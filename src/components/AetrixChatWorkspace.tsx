import React, { useState, useRef, useEffect } from "react";
import { 
  Menu, X, Sparkles, Folder, BookOpen, Clock, Settings, 
  Paperclip, Image as ImageIcon, Mic, Send, Copy, ThumbsUp, 
  ThumbsDown, Volume2, MessageSquare, ChevronRight, Check, CheckCheck,
  User, UserPlus, Shield, FileText, Info, LogOut, HelpCircle, LogIn,
  Play, Pause
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  image?: string;
  imageName?: string;
  images?: string[];
  imageNames?: string[];
  attachments?: {
    id: string;
    name: string;
    size: string;
    type: string;
    dataUrl: string;
  }[];
  voiceNoteUrl?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export default function AetrixChatWorkspace({ 
  onLogout, 
  userEmail, 
  userName,
  userAvatar,
  onOpenFeatures,
  isLoggedIn,
  onOpenLogin,
  onOpenSignUp,
  savedInputText,
  onSaveInputText,
  onOpenProjects,
  onOpenLibrary,
  onOpenProfile,
  onOpenSettings
}: { 
  onLogout: () => void; 
  userEmail: string; 
  userName?: string;
  userAvatar?: string;
  onOpenFeatures?: () => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  savedInputText: string;
  onSaveInputText: (text: string) => void;
  onOpenProjects?: () => void;
  onOpenLibrary?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
}) {
  // Navigation & UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSessionTitle, setActiveSessionTitle] = useState("New Chat");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Chatting State
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputText, setInputText] = useState(savedInputText || "");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "info" | "error"; message: string }[]>([]);

  // Long press, editing, select-text, renaming and delete states
  const [selectedMsgForMenu, setSelectedMsgForMenu] = useState<Message | null>(null);
  const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(false);
  const [isEditingMsg, setIsEditingMsg] = useState(false);
  const [editingMsgContent, setEditingMsgContent] = useState("");
  const [isSelectTextOpen, setIsSelectTextOpen] = useState(false);
  const [selectableText, setSelectableText] = useState("");
  
  const [selectedConvForMenu, setSelectedConvForMenu] = useState<Conversation | null>(null);
  const [isConvMenuOpen, setIsConvMenuOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [convToDeleteId, setConvToDeleteId] = useState<string | null>(null);

  // Timers and gesture tracking refs for long-press
  const messagePressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMessageLongPressedRef = useRef(false);
  const convPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isConvLongPressedRef = useRef(false);

  const handleMessagePressStart = (msg: Message) => {
    isMessageLongPressedRef.current = false;
    if (messagePressTimerRef.current) clearTimeout(messagePressTimerRef.current);
    messagePressTimerRef.current = setTimeout(() => {
      isMessageLongPressedRef.current = true;
      setSelectedMsgForMenu(msg);
      setIsMessageMenuOpen(true);
    }, 600);
  };

  const handleMessagePressEnd = (e: React.MouseEvent | React.TouchEvent, msg: Message) => {
    if (messagePressTimerRef.current) {
      clearTimeout(messagePressTimerRef.current);
      messagePressTimerRef.current = null;
    }
    if (isMessageLongPressedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const cancelMessagePress = () => {
    if (messagePressTimerRef.current) {
      clearTimeout(messagePressTimerRef.current);
      messagePressTimerRef.current = null;
    }
  };

  const convTouchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const convHasMovedRef = useRef<boolean>(false);

  const handleConvPressStart = (e: React.MouseEvent | React.TouchEvent, conv: Conversation) => {
    isConvLongPressedRef.current = false;
    convHasMovedRef.current = false;

    if ("touches" in e && e.touches.length > 0) {
      convTouchStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if ("clientX" in e) {
      convTouchStartPosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    } else {
      convTouchStartPosRef.current = null;
    }

    if (convPressTimerRef.current) clearTimeout(convPressTimerRef.current);
    convPressTimerRef.current = setTimeout(() => {
      isConvLongPressedRef.current = true;
      setSelectedConvForMenu(conv);
      setIsConvMenuOpen(true);
    }, 600);
  };

  const handleConvPressMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!convTouchStartPosRef.current) return;

    let currentX = 0;
    let currentY = 0;

    if ("touches" in e && e.touches.length > 0) {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      currentX = e.clientX;
      currentY = e.clientY;
    } else {
      return;
    }

    const diffX = Math.abs(currentX - convTouchStartPosRef.current.x);
    const diffY = Math.abs(currentY - convTouchStartPosRef.current.y);

    if (diffX > 8 || diffY > 8) {
      convHasMovedRef.current = true;
      cancelConvPress();
    }
  };

  const handleConvPressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (convPressTimerRef.current) {
      clearTimeout(convPressTimerRef.current);
      convPressTimerRef.current = null;
    }
    if (isConvLongPressedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const cancelConvPress = () => {
    if (convPressTimerRef.current) {
      clearTimeout(convPressTimerRef.current);
      convPressTimerRef.current = null;
    }
  };

  const handleConvClick = (e: React.MouseEvent, convId: string) => {
    if (convHasMovedRef.current || isConvLongPressedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    loadRecentChat(convId);
  };

  const handleSaveEditMessage = () => {
    if (!selectedMsgForMenu) return;
    const msgId = selectedMsgForMenu.id;
    const newContent = editingMsgContent;

    const updatedMessages = messages.map((m) => {
      if (m.id === msgId) {
        return { ...m, content: newContent };
      }
      return m;
    });
    setMessages(updatedMessages);

    if (activeConversationId) {
      updateConversationStateAndStorage(activeConversationId, activeSessionTitle, updatedMessages);
    }

    setIsEditingMsg(false);
    setSelectedMsgForMenu(null);
    setIsMessageMenuOpen(false);
    addToast("Message updated", "success");
  };

  const handleRenameSave = () => {
    if (!selectedConvForMenu) return;
    const convId = selectedConvForMenu.id;
    const newTitle = renameTitle.trim();
    if (!newTitle) return;

    setConversations((prevList) => {
      const updatedList = prevList.map((c) => {
        if (c.id === convId) {
          return { ...c, title: newTitle, updatedAt: Date.now() };
        }
        return c;
      });

      const key = `aetrix_conversations_${userEmail || "guest"}`;
      try {
        localStorage.setItem(key, JSON.stringify(updatedList));
      } catch (err) {
        console.error("Storage error:", err);
      }
      return updatedList;
    });

    if (activeConversationId === convId) {
      setActiveSessionTitle(newTitle);
    }

    setIsRenameOpen(false);
    setSelectedConvForMenu(null);
    setIsConvMenuOpen(false);
    addToast("Conversation renamed", "success");
  };

  // Load conversations based on userEmail or guest session
  useEffect(() => {
    const key = `aetrix_conversations_${userEmail || "guest"}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setConversations(JSON.parse(stored));
      } else {
        setConversations([]);
      }
    } catch (e) {
      console.error("Failed to load conversations", e);
      setConversations([]);
    }
  }, [userEmail]);

  // MULTIPLE IMAGES STATE
  interface UploadedImage {
    id: string;
    dataUrl: string;
    name: string;
  }
  interface UploadingImageStatus {
    id: string;
    name: string;
    progress: number;
  }
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState<UploadingImageStatus[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // ATTACHMENTS STATE
  interface UploadedAttachment {
    id: string;
    name: string;
    size: string;
    type: string;
    dataUrl: string;
  }
  interface UploadingAttachmentStatus {
    id: string;
    name: string;
    progress: number;
  }
  const [selectedAttachments, setSelectedAttachments] = useState<UploadedAttachment[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState<UploadingAttachmentStatus[]>([]);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // VOICE RECORDING STATE
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep these for legacy visual states if needed, but we will bind to them dynamically as helper views
  const selectedImage = selectedImages.length > 0 ? selectedImages[0].dataUrl : null;
  const selectedImageName = selectedImages.length > 0 ? selectedImages[0].name : "";
  const uploadingImage = uploadingImages.length > 0;
  const imageProgress = uploadingImages.length > 0 ? uploadingImages[0].progress : 0;

  // Formatting helpers
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // MULTI-IMAGE SELECT
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    (Array.from(files) as File[]).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        addToast(`Format error: ${file.name}. Use JPG, JPEG, PNG or WEBP.`, "error");
        return;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        addToast(`File too large: ${file.name}. Max allowed size is 10MB.`, "error");
        return;
      }

      const uploadId = "img-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
      setUploadingImages((prev) => [...prev, { id: uploadId, name: file.name, progress: 5 }]);

      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 50);
          setUploadingImages((prev) => 
            prev.map((item) => item.id === uploadId ? { ...item, progress: percent } : item)
          );
        }
      };

      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Data = event.target.result as string;
          let currentProgress = 50;
          const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 15) + 5;
            if (currentProgress >= 100) {
              currentProgress = 100;
              clearInterval(interval);
              setUploadingImages((prev) => prev.filter((item) => item.id !== uploadId));
              setSelectedImages((prev) => [...prev, { id: uploadId, dataUrl: base64Data, name: file.name }]);
              addToast(`Neural image loaded: ${file.name}`, "success");
            } else {
              setUploadingImages((prev) => 
                prev.map((item) => item.id === uploadId ? { ...item, progress: currentProgress } : item)
              );
            }
          }, 60);
        }
      };

      reader.onerror = () => {
        setUploadingImages((prev) => prev.filter((item) => item.id !== uploadId));
        addToast(`Failed to load: ${file.name}`, "error");
      };

      reader.readAsDataURL(file);
    });

    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleRemoveImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((item) => item.id !== id));
    addToast("Image removed", "info");
  };

  const handleRemoveSelectedImage = () => {
    setSelectedImages([]);
    setUploadingImages([]);
    addToast("All images removed", "info");
  };

  const triggerImageSelect = () => {
    if (!isLoggedIn) {
      setShowPremiumModal(true);
      return;
    }
    imageInputRef.current?.click();
  };

  // MULTIPLE ATTACHMENTS SELECT
  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file) => {
      const maxSize = 25 * 1024 * 1024; // 25MB
      if (file.size > maxSize) {
        addToast(`File too large: ${file.name}. Max size is 25MB.`, "error");
        return;
      }

      const uploadId = "att-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
      setUploadingAttachments((prev) => [...prev, { id: uploadId, name: file.name, progress: 5 }]);

      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 50);
          setUploadingAttachments((prev) => 
            prev.map((item) => item.id === uploadId ? { ...item, progress: percent } : item)
          );
        }
      };

      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Data = event.target.result as string;
          let currentProgress = 50;
          const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 15) + 5;
            if (currentProgress >= 100) {
              currentProgress = 100;
              clearInterval(interval);
              setUploadingAttachments((prev) => prev.filter((item) => item.id !== uploadId));
              setSelectedAttachments((prev) => [...prev, {
                id: uploadId,
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type || "application/octet-stream",
                dataUrl: base64Data
              }]);
              addToast(`Attachment loaded: ${file.name}`, "success");
            } else {
              setUploadingAttachments((prev) => 
                prev.map((item) => item.id === uploadId ? { ...item, progress: currentProgress } : item)
              );
            }
          }, 60);
        }
      };

      reader.onerror = () => {
        setUploadingAttachments((prev) => prev.filter((item) => item.id !== uploadId));
        addToast(`Failed to load file: ${file.name}`, "error");
      };

      reader.readAsDataURL(file);
    });

    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
  };

  const handleRemoveAttachment = (id: string) => {
    setSelectedAttachments((prev) => prev.filter((item) => item.id !== id));
    addToast("Attachment removed", "info");
  };

  const triggerAttachmentSelect = () => {
    if (!isLoggedIn) {
      setShowPremiumModal(true);
      return;
    }
    attachmentInputRef.current?.click();
  };

  // VOICE RECORDING LOGIC
  const startVoiceRecording = async () => {
    if (!isLoggedIn) {
      setShowPremiumModal(true);
      return;
    }

    try {
      // Check for getUserMedia support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        addToast("Recording not supported on this browser context", "error");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setRecordedAudioUrl(null);
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        
        // Convert to base64 so we can play & transmit
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setRecordedAudioUrl(reader.result as string);
          }
        };
        reader.readAsDataURL(audioBlob);

        stream.getTracks().forEach((track) => track.stop());
      };

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          if (currentTranscript) {
            setInputText((prev) => {
              const cleaned = prev.trim();
              return cleaned ? `${cleaned} ${currentTranscript.trim()}` : currentTranscript.trim();
            });
          }
        };

        recognition.onerror = (evt: any) => {
          console.error("Speech recognition error", evt.error);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        console.warn("Speech recognition not natively supported on this browser.");
      }

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      addToast("AETRIX neural voice capture active", "success");
    } catch (err: any) {
      console.error(err);
      addToast("Microphone permission denied or not found", "error");
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setIsRecording(false);
    addToast("Speech transcribed to neural buffer", "success");
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync internal inputText to savedInputText if it changes from parent
  useEffect(() => {
    if (savedInputText !== undefined && savedInputText !== inputText) {
      setInputText(savedInputText);
    }
  }, [savedInputText]);

  // Sync internal inputText back to parent
  const handleInputChange = (text: string) => {
    setInputText(text);
    onSaveInputText(text);
  };

  // Automatically expand/shrink the textarea height based on typing
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, 192); // Max height corresponding to 8 lines
    textarea.style.height = `${nextHeight}px`;
  }, [inputText]);

  // Quick toast helper
  const addToast = (message: string, type: "success" | "info" | "error" = "info") => {
    if (type !== "error") return;
    const id = Date.now().toString() + "-" + Math.floor(Math.random() * 1000000);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Update state and storage with dynamic chronological ordering (newest first)
  const updateConversationStateAndStorage = (convId: string, title: string, newMessages: Message[]) => {
    setConversations((prevList) => {
      const existingIdx = prevList.findIndex((c) => c.id === convId);
      let updatedList: Conversation[];
      if (existingIdx !== -1) {
        const updatedConv = {
          ...prevList[existingIdx],
          title: title,
          messages: newMessages,
          updatedAt: Date.now()
        };
        updatedList = [...prevList];
        updatedList[existingIdx] = updatedConv;
      } else {
        const newConv: Conversation = {
          id: convId,
          title: title,
          messages: newMessages,
          updatedAt: Date.now()
        };
        updatedList = [...prevList, newConv];
      }
      
      // Sort in chronological order (newest first)
      updatedList.sort((a, b) => b.updatedAt - a.updatedAt);
      
      const key = `aetrix_conversations_${userEmail || "guest"}`;
      try {
        localStorage.setItem(key, JSON.stringify(updatedList));
      } catch (err) {
        console.error("Storage error:", err);
      }
      return updatedList;
    });
  };

  // Load selected chat thread when tapping an item in Recent History
  const loadRecentChat = (convId: string) => {
    if (!isLoggedIn) {
      setShowPremiumModal(true);
      return;
    }
    const conv = conversations.find((c) => c.id === convId);
    if (!conv) return;

    setActiveConversationId(conv.id);
    setActiveSessionTitle(conv.title);
    setMessages(conv.messages);
    setIsSidebarOpen(false);
    setIsDropdownOpen(false);
    addToast(`Loaded conversation: "${conv.title}"`, "success");
  };

  // Permanently delete a conversation from history
  const handleDeleteConversation = (convId: string) => {
    setConversations((prevList) => {
      const updatedList = prevList.filter((c) => c.id !== convId);
      const key = `aetrix_conversations_${userEmail || "guest"}`;
      try {
        localStorage.setItem(key, JSON.stringify(updatedList));
      } catch (err) {
        console.error("Storage error:", err);
      }
      return updatedList;
    });

    if (activeConversationId === convId) {
      setMessages([]);
      setActiveConversationId(null);
      setActiveSessionTitle("New Chat");
    }
    
    addToast("Conversation deleted", "info");
  };

  // Handle Send Text & assets dynamically
  const handleSend = async () => {
    if (!inputText.trim() && selectedImages.length === 0 && selectedAttachments.length === 0 && !recordedAudioUrl) return;
    if (!isLoggedIn) {
      setShowPremiumModal(true);
      return;
    }

    const userText = inputText;
    const userImages = selectedImages.map((img) => img.dataUrl);
    const userImageNames = selectedImages.map((img) => img.name);
    const userAttachments = selectedAttachments;
    const userVoiceNote = recordedAudioUrl || undefined;

    // Single-asset values for backward compatibility
    const userImg = selectedImages.length > 0 ? selectedImages[0].dataUrl : undefined;
    const userImgName = selectedImages.length > 0 ? selectedImages[0].name : undefined;

    setInputText("");
    onSaveInputText("");
    setSelectedImages([]);
    setSelectedAttachments([]);
    setRecordedAudioUrl(null);

    const timestampStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: "user-" + Date.now() + "-" + Math.floor(Math.random() * 1000000),
      role: "user",
      content: userText,
      timestamp: timestampStr,
      image: userImg,
      imageName: userImgName,
      images: userImages,
      imageNames: userImageNames,
      attachments: userAttachments,
      voiceNoteUrl: userVoiceNote
    };

    // Determine active or brand-new conversation
    let convId = activeConversationId;
    let title = activeSessionTitle;

    if (!convId) {
      convId = "conv-" + Date.now();
      if (userText.trim()) {
        title = userText.trim().slice(0, 32);
        if (userText.trim().length > 32) title += "...";
      } else if (userImages && userImages.length > 0) {
        title = `Image: ${userImageNames[0] || "Asset"}`;
      } else if (userAttachments && userAttachments.length > 0) {
        title = `File: ${userAttachments[0].name}`;
      } else if (userVoiceNote) {
        title = "Voice Stream Note";
      } else {
        title = "New Chat";
      }
      setActiveConversationId(convId);
      setActiveSessionTitle(title);
    }

    const updatedUserMessages = [...messages, userMsg];
    setMessages(updatedUserMessages);
    updateConversationStateAndStorage(convId, title, updatedUserMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedUserMessages.map((m) => ({ 
            role: m.role, 
            content: m.content,
            image: m.image,
            imageName: m.imageName,
            images: m.images,
            imageNames: m.imageNames,
            attachments: m.attachments,
            voiceNoteUrl: m.voiceNoteUrl
          }))
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        const assistantMsg: Message = {
          id: "ai-" + Date.now() + "-" + Math.floor(Math.random() * 1000000),
          role: "assistant",
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages((prev) => {
          const updatedAll = [...prev, assistantMsg];
          updateConversationStateAndStorage(convId!, title, updatedAll);
          return updatedAll;
        });
      } else {
        throw new Error(data.error || "Failed to retrieve stream response");
      }
    } catch (err: any) {
      console.error(err);
      
      const errorMsg: Message = {
        id: "ai-" + Date.now() + "-" + Math.floor(Math.random() * 1000000),
        role: "assistant",
        content: `### ⚠️ API Connection Error

We encountered an error attempting to process your neural stream query. 

**Error Details**:
\`\`\`text
${err.message || "An unexpected error occurred while communicating with the server."}
\`\`\`

**Troubleshooting Steps**:
1. Verify that your **GEMINI_API_KEY** is defined in your platform environment or AI Studio secrets panel.
2. Check your network connection.
3. If the error is a quota limit (429), please wait a moment before trying again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => {
        const updatedAll = [...prev, errorMsg];
        updateConversationStateAndStorage(convId!, title, updatedAll);
        return updatedAll;
      });
      setIsLoading(false);
      return;

      // Premium elegant inline offline simulation fallback
      setTimeout(() => {
        let fallbackContent = `### Aetrix AI Intelligence Response\n\nI processed your request`;
        if (userText) fallbackContent += `: **"${userText}"**`;
        fallbackContent += `.\n\n* **Model Active**: \`Gemini 2.5 Flash\`\n* **Status**: Local simulation sandbox fallback is active.`;
        
        if (userImages && userImages.length > 0) {
          fallbackContent += `\n* **Images Synced**: ${userImages.length} asset(s) analyzed (**${userImageNames.join(", ")}**).`;
        }
        if (userAttachments && userAttachments.length > 0) {
          fallbackContent += `\n* **Files Synced**: ${userAttachments.length} document(s) uploaded (**${userAttachments.map((a: any) => a.name).join(", ")}**).`;
        }
        if (userVoiceNote) {
          fallbackContent += `\n* **Voice Stream Synced**: Neural audio frequency stream evaluated.`;
        }
        
        fallbackContent += `\n\nLet me know if you would like me to assist you with further details or questions!`;

        const assistantMsg: Message = {
          id: "ai-" + Date.now() + "-" + Math.floor(Math.random() * 1000000),
          role: "assistant",
          content: fallbackContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };

        setMessages((prev) => {
          const updatedAll = [...prev, assistantMsg];
          updateConversationStateAndStorage(convId!, title, updatedAll);
          return updatedAll;
        });
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast("Copied to clipboard", "success");
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#`]/g, "");
      const utterance = new SpeechSynthesisUtterance(clean);
      window.speechSynthesis.speak(utterance);
      addToast("Playing voice synthesis...", "success");
    } else {
      addToast("Voice synthesis not supported on this device", "error");
    }
  };

  const resetToEmptyState = () => {
    setMessages([]);
    setActiveSessionTitle("New Chat");
    setActiveConversationId(null);
    setIsSidebarOpen(false);
    setIsDropdownOpen(false);
    addToast("New Chat sequence initialized", "success");
  };



  // Inline markdown renderer with clean styles
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-white text-base font-bold mt-4 mb-2 tracking-wide font-sans">{line.substring(4)}</h3>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-white text-lg font-bold mt-5 mb-2.5 tracking-wide border-b border-white/10 pb-1 font-sans">{line.substring(3)}</h2>;
      }
      if (line.startsWith("# ")) {
        return <h1 key={idx} className="text-white text-xl font-bold mt-6 mb-3 tracking-wide font-sans">{line.substring(2)}</h1>;
      }
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1.5 pl-2 text-gray-300 text-sm leading-relaxed">
            <span className="text-[#00BFFF] mt-2 shrink-0 select-none">•</span>
            <span>{parseInline(line.trim().substring(2))}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(line.trim())) {
        const num = line.trim().match(/^\d+/)?.[0];
        const rest = line.trim().replace(/^\d+\.\s/, "");
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 pl-2 text-gray-300 text-sm leading-relaxed">
            <span className="text-[#00BFFF] font-bold text-xs mt-0.5">{num}.</span>
            <span>{parseInline(rest)}</span>
          </div>
        );
      }
      if (line.trim() === "") return <div key={idx} className="h-2"></div>;
      return <p key={idx} className="text-gray-300 text-sm md:text-base leading-relaxed my-1 font-sans select-text whitespace-pre-wrap">{parseInline(line)}</p>;
    });
  };

  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="bg-white/10 text-[#00BFFF] px-1 py-0.5 rounded font-mono text-xs">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#000000] flex text-white font-sans overflow-hidden select-none z-10" id="aetrix-full-workspace">
      
      {/* Toast Notification Layer */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5" id="toast-overlay">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`px-5 py-3 rounded-2xl border flex items-center gap-3.5 backdrop-blur-md shadow-2xl transition-all duration-300 ${
              t.type === "success" ? "bg-black/90 border-[#00BFFF]/40 text-cyan-200" :
              t.type === "error" ? "bg-black/90 border-red-500/30 text-red-300" :
              "bg-black/90 border-white/10 text-gray-200"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              t.type === "success" ? "bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" :
              t.type === "error" ? "bg-red-500 shadow-[0_0_8px_#EF4444]" :
              "bg-gray-400"
            }`} />
            <span className="text-xs font-sans tracking-wide">{t.message}</span>
          </div>
        ))}
      </div>

      {/* ---------------------------------------------------- */}
      {/* SIDEBAR COMPONENT (Screen 2 / 3 Layout) */}
      {/* ---------------------------------------------------- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-[310px] bg-[#000000] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isLoggedIn ? "lg:static lg:translate-x-0 lg:z-auto" : "hidden lg:hidden"}`}
        id="aetrix-sidebar"
      >
        <div className="p-5 pb-0 flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Header Title & Close Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-[0.18em] text-lg text-white">AETRIX <span className="text-[#00BFFF]">AI</span></span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat sequence - Highlighted styling as in Screen 2 */}
          <button 
            onClick={resetToEmptyState}
            className="w-full h-[48px] rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 px-4 text-sm text-white font-medium hover:bg-white/10 transition-colors cursor-pointer"
            id="sidebar-new-chat-btn"
          >
            <MessageSquare className="w-4 h-4 text-gray-300" />
            <span>New Chat</span>
          </button>

          {/* Search bar for conversations */}
          <div className="relative px-1">
            <input 
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[36px] pl-8 pr-3 text-xs text-white bg-white/10 border border-white/10 rounded-xl outline-none focus:border-[#00BFFF]/50 transition-colors placeholder-gray-500 font-sans"
            />
            <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">🔍</span>
          </div>

          {/* Standard Navigation Links */}
          <div className="flex flex-col gap-1.5 mt-2">
            {[
              { label: "AI Features", icon: Sparkles },
              { label: "Projects", icon: Folder },
              { label: "Library", icon: BookOpen }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setIsSidebarOpen(false);
                    if (item.label === "AI Features" && onOpenFeatures) {
                      onOpenFeatures();
                    } else if (item.label === "Projects" && onOpenProjects) {
                      onOpenProjects();
                    } else if (item.label === "Library" && onOpenLibrary) {
                      onOpenLibrary();
                    } else {
                      addToast(`${item.label} activated`, "info");
                    }
                  }}
                  className="flex items-center gap-3 px-4 h-[44px] rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="h-[1px] bg-white/10 my-1" />

          {/* Recents list from Screen 2 */}
          <div className="flex flex-col gap-1 select-none flex-1 min-h-0">
            <div className="flex items-center justify-between px-4 mb-2 shrink-0">
              <span className="text-xs text-gray-500 font-semibold">Recents</span>
              {conversations.length > 0 && (
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to permanently delete all conversations? This action cannot be undone.")) {
                      setConversations([]);
                      const key = `aetrix_conversations_${userEmail || "guest"}`;
                      localStorage.setItem(key, JSON.stringify([]));
                      setMessages([]);
                      setActiveConversationId(null);
                      setActiveSessionTitle("New Chat");
                      addToast("All conversations deleted.", "success");
                    }
                  }}
                  className="text-[10px] text-red-400 hover:text-red-300 transition-colors font-medium cursor-pointer"
                >
                  Delete All
                </button>
              )}
            </div>
            <div className="flex-1 min-h-0 flex flex-col gap-1 overflow-y-auto pr-1">
              {conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <div className="px-4 py-6 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-gray-400">
                    {searchQuery ? "No matches found" : "No recent chats"}
                  </span>
                  <span className="text-[10px] text-gray-600 leading-normal mt-1 max-w-[200px]">
                    {searchQuery ? "Try refining your search query." : "Start a new conversation to create your history."}
                  </span>
                </div>
              ) : (
                conversations
                  .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((conv) => {
                  const isActive = activeConversationId === conv.id;
                  return (
                    <div
                      key={conv.id}
                      className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer select-none ${
                        isActive 
                          ? "bg-white/5 text-white" 
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      onMouseDown={(e) => handleConvPressStart(e, conv)}
                      onMouseUp={handleConvPressEnd}
                      onMouseLeave={cancelConvPress}
                      onTouchStart={(e) => handleConvPressStart(e, conv)}
                      onTouchEnd={handleConvPressEnd}
                      onTouchMove={handleConvPressMove}
                      onTouchCancel={cancelConvPress}
                      onClick={(e) => handleConvClick(e, conv.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setSelectedConvForMenu(conv);
                        setIsConvMenuOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 text-left bg-transparent border-none outline-none text-inherit">
                        <MessageSquare className="w-4 h-4 text-gray-500 shrink-0" />
                        <span className="truncate">{conv.title}</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConvToDeleteId(conv.id);
                          setIsDeleteConfirmOpen(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all rounded-md cursor-pointer ml-1 shrink-0"
                        title="Delete Conversation"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-2 bg-[#050505]">
          <button 
            onClick={() => {
              setIsSidebarOpen(false);
              if (onOpenProfile) {
                onOpenProfile();
              } else {
                addToast("My Profile activated", "info");
              }
            }}
            className="flex items-center justify-between gap-3 px-2 py-1.5 hover:bg-white/5 rounded-xl transition-all text-left cursor-pointer w-full group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#1E90FF] flex items-center justify-center text-white font-bold text-xs shadow-md shadow-[#00BFFF]/10 shrink-0 group-hover:scale-105 transition-transform">
                  {userName ? userName.slice(0, 2).toUpperCase() : "AD"}
                </div>
              )}
              <div className="flex flex-col truncate min-w-0">
                <span className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">{userName || "Alex Design"}</span>
                <span className="text-[10px] text-gray-500 truncate">{userEmail}</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#00BFFF] transition-colors shrink-0" />
          </button>
          <button 
            onClick={onLogout}
            className="w-full py-2 bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Logout System
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTAINER (Screen 1 / 3 Layout) */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#000000] relative" id="aetrix-main-content">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        {/* Top Navbar */}
        <header className="h-[64px] border-b border-white/10 flex items-center justify-between px-5 bg-[#000000] relative z-30 select-none">
          {/* Left Menu toggle */}
          {isLoggedIn ? (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-9 h-9 lg:hidden" /> // Placeholder so layout remains balanced
          )}

          {/* Centered Brand Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1.5">
            <span className="font-bold tracking-[0.2em] text-sm text-white">AETRIX <span className="text-[#00BFFF]">AI</span></span>
          </div>

          {/* Right ⋮ Button */}
          <div className="relative lg:absolute lg:top-4 lg:right-6">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className="text-xl font-bold block leading-none select-none">⋮</span>
            </button>

            {/* ---------------------------------------------------- */}
            {/* THREE-DOT FLOATING POPUP (Screen 3 Layout) */}
            {/* ---------------------------------------------------- */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-[220px] rounded-2xl bg-[#09090b] border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.9),0_0_24px_rgba(0,191,255,0.1)] overflow-hidden z-50 p-1.5 select-none animate-slide-in backdrop-blur-xl">
                  
                  {!isLoggedIn ? (
                    <>
                      {/* GUEST MODE DROPDOWN OPTIONS */}
                      <button 
                        onClick={() => { setIsDropdownOpen(false); onOpenLogin(); }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <span>Login</span>
                      </button>

                      <button 
                        onClick={() => { setIsDropdownOpen(false); onOpenSignUp(); }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <UserPlus className="w-4 h-4 text-gray-500" />
                        <span>Sign Up</span>
                      </button>

                      <div className="h-[1px] bg-white/10 my-1.5" />

                      <button 
                        onClick={() => { setIsDropdownOpen(false); addToast("AETRIX AI v2.5: Deep Neural cognitive workspace.", "info"); }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <Info className="w-4 h-4 text-gray-500" />
                        <span>About AETRIX AI</span>
                      </button>

                      <button 
                        onClick={() => { setIsDropdownOpen(false); addToast("Your sessions are fully encrypted and secure.", "info"); }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <Shield className="w-4 h-4 text-gray-500" />
                        <span>Privacy Policy</span>
                      </button>

                      <button 
                        onClick={() => { setIsDropdownOpen(false); addToast("Terms of Service initialized.", "info"); }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span>Terms & Conditions</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* AUTHENTICATED MODE DROPDOWN OPTIONS */}
                      <button 
                        onClick={() => { 
                          setIsDropdownOpen(false); 
                          if (onOpenProfile) onOpenProfile();
                          else addToast("Profile Loaded: Alex Design", "success"); 
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <User className="w-4 h-4 text-[#00BFFF]" />
                        <span>Profile</span>
                      </button>

                      <button 
                        onClick={() => { 
                          setIsDropdownOpen(false); 
                          if (onOpenSettings) onOpenSettings();
                          else addToast("Settings sequence loaded.", "info"); 
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        <span>Settings</span>
                      </button>

                      <button 
                        onClick={() => { setIsDropdownOpen(false); addToast("Chat History logs accessed.", "info"); }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>Chat History</span>
                      </button>



                      <button 
                        onClick={() => { 
                          setIsDropdownOpen(false); 
                          if (onOpenFeatures) {
                            onOpenFeatures();
                          } else {
                            addToast("AI Tools features list initialized.", "success");
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <Sparkles className="w-4 h-4 text-[#00BFFF]" />
                        <span>AI Tools</span>
                      </button>

                      <button 
                        onClick={() => { setIsDropdownOpen(false); addToast("Connecting with tech support system...", "info"); }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <HelpCircle className="w-4 h-4 text-gray-500" />
                        <span>Help & Support</span>
                      </button>

                      <button 
                        onClick={() => { setIsDropdownOpen(false); addToast("AETRIX AI v2.5: Deep Neural cognitive workspace.", "info"); }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <Info className="w-4 h-4 text-gray-500" />
                        <span>About</span>
                      </button>

                      <div className="h-[1px] bg-white/10 my-1.5" />

                      <button 
                        onClick={() => { setIsDropdownOpen(false); onLogout(); }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Logout</span>
                      </button>
                    </>
                  )}

                </div>
              </>
            )}
          </div>
        </header>

        {/* ---------------------------------------------------- */}
        {/* CHAT MAIN SECTION */}
        {/* ---------------------------------------------------- */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 flex flex-col" id="aetrix-messages-pane">
          
          {messages.length === 0 ? (
            /* SCREEN 1: EMPTY STATE VIEW */
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12 px-4" id="empty-chat-welcome-box">
              
              {/* Central Glowing speech bubble icon as in Left Screen */}
              <div className="relative w-44 h-44 flex items-center justify-center mb-4" id="aetrix-central-glow-logo">
                {/* Glowing neon background halo */}
                <div className="absolute w-28 h-28 rounded-full bg-[#00BFFF]/10 blur-2xl animate-pulse" />
                
                {/* Micro stars/sparkles scattered around */}
                <svg className="absolute top-2 right-4 w-5 h-5 text-blue-400 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/>
                </svg>
                <svg className="absolute bottom-8 left-4 w-4 h-4 text-blue-400 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/>
                </svg>
                <svg className="absolute top-14 left-6 w-3.5 h-3.5 text-blue-300 opacity-55" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z"/>
                </svg>

                {/* Glowing Speech Bubble with 3 dots inside */}
                <div className="relative w-32 h-24 rounded-[30px] border-2 border-[#00BFFF] bg-[#000000] shadow-[0_0_35px_rgba(0,191,255,0.4),inset_0_0_12px_rgba(0,191,255,0.15)] flex items-center justify-center">
                  <div className="absolute -bottom-2 left-10 w-5 h-5 bg-[#000000] border-r-2 border-b-2 border-[#00BFFF] transform rotate-45 rounded-br-sm" />
                  <div className="flex gap-2.5 z-10">
                    <div className="w-3 h-3 rounded-full bg-[#00BFFF] shadow-[0_0_6px_#00BFFF] animate-[bounce_1.2s_infinite_0s]" />
                    <div className="w-3 h-3 rounded-full bg-[#00BFFF] shadow-[0_0_6px_#00BFFF] animate-[bounce_1.2s_infinite_0.15s]" />
                    <div className="w-3 h-3 rounded-full bg-[#00BFFF] shadow-[0_0_6px_#00BFFF] animate-[bounce_1.2s_infinite_0.3s]" />
                  </div>
                </div>
              </div>

              {/* Title welcome section */}
              <h2 className="text-xl md:text-2xl font-bold tracking-normal text-white mb-2 font-sans" id="hello-greeting">
                Hello, How can I help you today?
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm" id="hello-subtitle">
                Start a new conversation <br />
                and explore the power of AI
              </p>
            </div>
          ) : (
            /* ACTIVE CHAT AREA */
            <div className="flex-1 flex flex-col gap-6 max-w-5xl w-full mx-auto pb-4" id="messages-list">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col gap-1.5 w-full ${isUser ? "items-end" : "items-start"}`}
                    id={`message-container-${msg.id}`}
                  >
                    
                    {/* Message content wrapper */}
                    <div className={isUser ? "max-w-[85%] sm:max-w-[78%]" : "w-[92%] sm:w-[95%] max-w-[95%]"}>
                      <div 
                        className={`rounded-2xl select-none text-left break-words cursor-pointer transition-all active:scale-[0.99] duration-150 relative ${
                          isUser 
                            ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white rounded-tr-none border border-blue-500/25 shadow-md shadow-blue-500/5 p-4" 
                            : "bg-[#09090b]/85 backdrop-blur-md border border-white/10 text-gray-200 rounded-tl-none w-full p-5 md:p-6 shadow-xl"
                        }`}
                        id={`message-body-${msg.id}`}
                        onMouseDown={() => handleMessagePressStart(msg)}
                        onMouseUp={(e) => handleMessagePressEnd(e, msg)}
                        onMouseLeave={cancelMessagePress}
                        onTouchStart={() => handleMessagePressStart(msg)}
                        onTouchEnd={(e) => handleMessagePressEnd(e, msg)}
                        onTouchMove={cancelMessagePress}
                        onTouchCancel={cancelMessagePress}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setSelectedMsgForMenu(msg);
                          setIsMessageMenuOpen(true);
                        }}
                      >
                        {/* Standard line renderer */}
                        <div className="space-y-3 break-words overflow-x-hidden select-text">
                          {/* Render single image if msg.images is empty, for backward compatibility */}
                          {msg.image && (!msg.images || msg.images.length === 0) && (
                            <div className="mb-3 max-w-full sm:max-w-md rounded-xl overflow-hidden border border-white/10 shadow-lg relative group">
                              <img 
                                src={msg.image} 
                                alt={msg.imageName || "Uploaded asset"} 
                                className="w-full h-auto max-h-72 object-contain rounded-xl hover:scale-[1.01] transition-transform duration-300" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          {/* Multiple Images Grid */}
                          {msg.images && msg.images.length > 0 && (
                            <div className={`grid gap-2 mb-3 max-w-full sm:max-w-xl ${msg.images.length === 1 ? "grid-cols-1 max-w-md" : "grid-cols-2 sm:grid-cols-3"}`}>
                              {msg.images.map((imgUrl, idx) => (
                                <div key={idx} className="rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-lg relative group aspect-square">
                                  <img 
                                    src={imgUrl} 
                                    alt={msg.imageNames?.[idx] || "Uploaded asset"} 
                                    className="w-full h-full object-cover rounded-xl hover:scale-[1.03] transition-transform duration-300 cursor-zoom-in" 
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Document Attachments list */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-col gap-2 mb-3 max-w-full sm:max-w-md">
                              {msg.attachments.map((att) => (
                                <a 
                                  key={att.id}
                                  href={att.dataUrl}
                                  download={att.name}
                                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
                                >
                                  <FileText className="w-5 h-5 text-[#00BFFF] shrink-0" />
                                  <div className="flex-1 min-w-0 flex flex-col text-left">
                                    <span className="truncate font-mono">{att.name}</span>
                                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">{att.size} • {att.type.split("/")[1]?.toUpperCase() || "DOCUMENT"}</span>
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Voice Recording note player */}
                          {msg.voiceNoteUrl && (
                            <div className="mb-3 max-w-full sm:max-w-sm flex items-center gap-3 p-3 bg-gradient-to-r from-blue-950/40 to-black/40 border border-[#00BFFF]/20 rounded-xl">
                              <div className="w-8 h-8 rounded-full bg-[#00BFFF]/15 flex items-center justify-center shrink-0">
                                <Mic className="w-4 h-4 text-[#00BFFF]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] uppercase font-bold tracking-wider text-[#00BFFF]">Voice Recording</span>
                                <audio src={msg.voiceNoteUrl} controls className="h-6 mt-1 max-w-full accent-[#00BFFF]" />
                              </div>
                            </div>
                          )}

                          {msg.content && renderMarkdown(msg.content)}
                        </div>
                      </div>

                      {/* Message Metadata & Interaction Buttons */}
                      {!isUser && (
                        <div className="flex items-center gap-3 px-1 mt-1.5 select-none text-[10px] text-gray-500 justify-start">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => copyToClipboard(msg.content)}
                              className="p-1 rounded hover:bg-white/5 hover:text-white transition-colors cursor-pointer" 
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => speakText(msg.content)}
                              className="p-1 rounded hover:bg-white/5 hover:text-white transition-colors cursor-pointer" 
                              title="Speak"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => addToast("Signal positive", "success")}
                              className="p-1 rounded hover:bg-white/5 hover:text-[#00BFFF] transition-colors cursor-pointer"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => addToast("Signal negative", "info")}
                              className="p-1 rounded hover:bg-white/5 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Bouncing loading indicator matching reference styles */}
              {isLoading && (
                <div className="flex items-start gap-3" id="answer-loading-container">
                  <div className="rounded-2xl border border-white/10 bg-[#09090b] p-4 max-w-[320px] flex flex-col gap-2 shadow-xl" id="answer-loading-card">
                    <span className="text-gray-400 text-xs font-mono tracking-widest uppercase">Thinking...</span>
                    <div className="flex items-center gap-2 py-1">
                      <div className="w-2 h-2 rounded-full bg-[#00BFFF] animate-bounce" style={{ animationDelay: "0s" }} />
                      <div className="w-2 h-2 rounded-full bg-[#00BFFF] animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <div className="w-2 h-2 rounded-full bg-[#00BFFF] animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* ---------------------------------------------------- */}
        {/* BOTTOM INPUT CONTAINER (Pictured in Screen 1 & 3) */}
        {/* ---------------------------------------------------- */}
        <footer className="p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent sticky bottom-0 z-20 select-none animate-fade-in" id="aetrix-bottom-input-pane">
          <div className="max-w-3xl mx-auto">
            
            {/* Rounded grey-bordered container holding input & lower button list */}
            <div className="border border-white/10 bg-[#0c0c0e]/85 backdrop-blur-xl rounded-[24px] px-4 py-3 flex flex-col gap-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.6)]" id="input-bar-glow">
              
              {/* Asset Previews & Upload Progress Panels */}
              <AnimatePresence>
                {(uploadingImages.length > 0 || selectedImages.length > 0 || uploadingAttachments.length > 0 || selectedAttachments.length > 0 || recordedAudioUrl) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-wrap items-center gap-3 px-2 py-2 border-b border-white/5 overflow-x-auto max-h-48 shrink-0"
                  >
                    {/* Uploading Images */}
                    {uploadingImages.map((item) => (
                      <div key={item.id} className="relative w-14 h-14 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-[#00BFFF]/10 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-[#00BFFF] z-10">{item.progress}%</span>
                        <div className="absolute bottom-1 left-1.5 right-1.5 h-1 bg-white/10 rounded-full overflow-hidden z-10">
                          <div className="h-full bg-gradient-to-r from-[#1E90FF] to-[#00BFFF]" style={{ width: `${item.progress}%` }} />
                        </div>
                      </div>
                    ))}

                    {/* Uploaded Images */}
                    {selectedImages.map((img) => (
                      <div key={img.id} className="relative w-14 h-14 rounded-xl border border-[#00BFFF]/30 bg-black overflow-hidden shrink-0 group">
                        <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-md transition-all cursor-pointer z-10"
                          title="Remove image"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}

                    {/* Uploading Attachments */}
                    {uploadingAttachments.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs shrink-0 max-w-xs animate-pulse">
                        <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                          <FileText className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1 text-left">
                          <span className="text-[10px] text-gray-300 truncate font-mono max-w-[120px]">{item.name}</span>
                          <span className="text-[8px] text-[#00BFFF] font-mono font-bold">Loading... {item.progress}%</span>
                        </div>
                      </div>
                    ))}

                    {/* Uploaded Attachments */}
                    {selectedAttachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-2 px-3 py-2 bg-blue-950/20 border border-[#00BFFF]/20 rounded-xl text-xs shrink-0 max-w-xs group relative">
                        <FileText className="w-4 h-4 text-[#00BFFF] shrink-0" />
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="text-[10px] text-gray-300 truncate font-mono max-w-[120px]">{att.name}</span>
                          <span className="text-[8px] text-gray-500 font-bold uppercase">{att.size}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="p-0.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all cursor-pointer ml-1"
                          title="Remove attachment"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}

                    {/* Recorded Audio Preview */}
                    {recordedAudioUrl && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-xl text-xs shrink-0 max-w-xs group">
                        <Mic className="w-4 h-4 text-[#00BFFF] shrink-0 animate-pulse" />
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] text-[#00BFFF] font-bold uppercase tracking-wider">Neural Voice Note</span>
                          <audio src={recordedAudioUrl} controls className="h-5 mt-1 max-w-[150px] accent-[#00BFFF]" />
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            setRecordedAudioUrl(null);
                            addToast("Voice note removed", "info");
                          }}
                          className="p-0.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all cursor-pointer ml-1"
                          title="Remove voice note"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input box / Voice Recording Overlay Panel */}
              <AnimatePresence mode="wait">
                {isRecording ? (
                  <motion.div 
                    key="voice-rec"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center justify-between w-full py-3.5 px-4 bg-gradient-to-r from-blue-950/40 via-[#00BFFF]/5 to-blue-950/40 border border-[#00BFFF]/30 rounded-[18px] shadow-[0_0_20px_rgba(0,191,255,0.15)] overflow-hidden"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40">
                        <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                        <Mic className="w-4 h-4 text-red-500 animate-pulse" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-white tracking-wider font-sans">AETRIX Audio Receiver</span>
                        <span className="text-[9px] text-gray-400 font-mono">Stream: Translating frequency pathways</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Pulsing Audio Lines */}
                      <div className="hidden sm:flex items-center gap-1">
                        <div className="w-0.5 h-3 bg-[#00BFFF] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-0.5 h-5 bg-[#00BFFF] rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                        <div className="w-0.5 h-2 bg-[#00BFFF] rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
                        <div className="w-0.5 h-4 bg-[#00BFFF] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="w-0.5 h-1.5 bg-[#00BFFF] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>

                      {/* Timer */}
                      <span className="text-xs font-mono font-bold text-[#00BFFF] tracking-widest bg-black/60 px-2.5 py-1 rounded-md border border-[#00BFFF]/20">
                        {formatDuration(recordingDuration)}
                      </span>
                      
                      {/* Stop Recording */}
                      <button 
                        onClick={stopVoiceRecording}
                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-red-600 transition-colors cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:scale-102 active:scale-98"
                      >
                        Stop Capture
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <textarea 
                    key="textarea-input"
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full bg-transparent border-none outline-none text-white text-sm md:text-base placeholder-gray-500 py-1 resize-none max-h-[192px] overflow-y-auto select-text"
                    id="message-text-area"
                  />
                )}
              </AnimatePresence>

              {/* Lower Tool Line (Icons Left, Blue Send Right) */}
              <div className="flex items-center justify-between pt-1">
                
                {/* Left Attachments list */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={triggerAttachmentSelect}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      selectedAttachments.length > 0 || uploadingAttachments.length > 0
                        ? "text-[#00BFFF]" 
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Attach File"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={triggerImageSelect}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      selectedImages.length > 0 || uploadingImages.length > 0
                        ? "text-[#00BFFF]" 
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Load Image"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={toggleVoiceRecording}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      isRecording 
                        ? "text-red-500 animate-pulse" 
                        : recordedAudioUrl 
                          ? "text-[#00BFFF]" 
                          : "text-gray-400 hover:text-white"
                    }`}
                    title="Microphone input"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>

                {/* Right blue round send button */}
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim() && selectedImages.length === 0 && selectedAttachments.length === 0 && !recordedAudioUrl}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    inputText.trim() || selectedImages.length > 0 || selectedAttachments.length > 0 || recordedAudioUrl
                      ? "bg-[#00BFFF] hover:bg-blue-500 text-white shadow-[0_0_12px_rgba(0,191,255,0.4)] cursor-pointer" 
                      : "bg-[#2563EB]/45 text-gray-400 cursor-not-allowed"
                  }`}
                  id="send-message-btn"
                >
                  <Send className="w-4.5 h-4.5 transform rotate-45 -translate-x-0.5 translate-y-0.5" />
                </button>

              </div>
            </div>

          </div>
        </footer>

      </div>

      {/* ---------------------------------------------------- */}
      {/* PREMIUM GUEST POPUP MODAL */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with elegant glass blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPremiumModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-sm bg-[#0d1222]/95 border border-[#00BFFF]/30 rounded-[28px] p-8 shadow-[0_0_50px_rgba(0,191,255,0.25)] text-center overflow-hidden z-10"
              id="premium-popup-box"
            >
              {/* Top ambient aura */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#00BFFF]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Sparkles / Locking glowing visual */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1E90FF]/20 to-[#00BFFF]/30 border border-[#00BFFF]/40 flex items-center justify-center mx-auto mb-5 shadow-[0_0_15px_rgba(0,191,255,0.25)] relative">
                <Sparkles className="w-8 h-8 text-[#00BFFF] animate-pulse" />
              </div>

              {/* Title welcome */}
              <h3 className="text-lg font-bold text-white tracking-wide mb-2.5">
                Authentication Required
              </h3>
              
              {/* Custom detailed prompt text */}
              <p className="text-gray-300 text-xs leading-relaxed mb-6 px-1 font-sans">
                Please Login or Sign Up to continue using AETRIX AI.
              </p>

              {/* Interaction buttons */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setShowPremiumModal(false);
                    onOpenLogin();
                  }}
                  className="w-full h-[46px] rounded-xl bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] text-white font-semibold text-xs hover:opacity-95 shadow-[0_4px_16px_rgba(0,191,255,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
                >
                  Login to Account
                </button>

                <button 
                  onClick={() => {
                    setShowPremiumModal(false);
                    onOpenSignUp();
                  }}
                  className="w-full h-[46px] rounded-xl bg-white/5 border border-white/10 text-gray-200 text-xs font-semibold hover:bg-white/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
                >
                  Sign Up for Free
                </button>
              </div>

              {/* Dismiss button */}
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="mt-5 text-[11px] text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                Continue in Guest Mode
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MESSAGE OPTIONS BOTTOM SHEET */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isMessageMenuOpen && selectedMsgForMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMessageMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            />
            
            {/* Bottom Sheet wrapper */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 bg-[#09090b]/95 border-t border-white/10 rounded-t-[24px] z-50 shadow-[0_-8px_40px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto pb-safe flex flex-col items-center"
            >
              {/* Handle bar */}
              <div className="w-12 h-1 bg-white/20 rounded-full my-3.5" />
              
              <div className="w-full max-w-md px-6 pb-8 text-left select-none">
                <div className="flex flex-col gap-1.5 mb-5 border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {selectedMsgForMenu.role === "user" ? "User Message Options" : "AI Message Options"}
                  </span>
                  <p className="text-xs text-gray-400 truncate font-sans max-w-sm">
                    {selectedMsgForMenu.content || "Media asset attached"}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  {selectedMsgForMenu.role === "user" && (
                    <button
                      onClick={() => {
                        setEditingMsgContent(selectedMsgForMenu.content);
                        setIsEditingMsg(true);
                        setIsMessageMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-left"
                    >
                      <span className="text-base shrink-0">✏️</span>
                      <span>✏️ Edit Message</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMsgForMenu.content);
                      addToast("Copied to clipboard", "success");
                      setIsMessageMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-left"
                  >
                    <span className="text-base shrink-0">📋</span>
                    <span>📋 Copy Message</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectableText(selectedMsgForMenu.content);
                      setIsSelectTextOpen(true);
                      setIsMessageMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-left"
                  >
                    <span className="text-base shrink-0">🔤</span>
                    <span>🔤 Select Text</span>
                  </button>
                </div>
                
                <button
                  onClick={() => setIsMessageMenuOpen(false)}
                  className="w-full mt-4 flex items-center justify-center py-3 rounded-xl text-xs font-bold text-gray-500 hover:text-white bg-transparent hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* CONVERSATION OPTIONS BOTTOM SHEET */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isConvMenuOpen && selectedConvForMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConvMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            />
            
            {/* Bottom Sheet wrapper */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 bg-[#09090b]/95 border-t border-white/10 rounded-t-[24px] z-50 shadow-[0_-8px_40px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto pb-safe flex flex-col items-center"
            >
              {/* Handle bar */}
              <div className="w-12 h-1 bg-white/20 rounded-full my-3.5" />
              
              <div className="w-full max-w-md px-6 pb-8 text-left select-none">
                <div className="flex flex-col gap-1.5 mb-5 border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Conversation Options
                  </span>
                  <p className="text-xs text-white truncate font-semibold max-w-sm">
                    {selectedConvForMenu.title}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setRenameTitle(selectedConvForMenu.title);
                      setIsRenameOpen(true);
                      setIsConvMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-left"
                  >
                    <span className="text-base shrink-0">📝</span>
                    <span>📝 Rename Chat</span>
                  </button>
                  


                  <button
                    onClick={() => {
                      setConvToDeleteId(selectedConvForMenu.id);
                      setIsDeleteConfirmOpen(true);
                      setIsConvMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/10 hover:bg-red-950/25 active:scale-[0.98] transition-all cursor-pointer text-left"
                  >
                    <span className="text-base shrink-0">🗑️</span>
                    <span>🗑️ Delete Chat</span>
                  </button>
                </div>
                
                <button
                  onClick={() => setIsConvMenuOpen(false)}
                  className="w-full mt-4 flex items-center justify-center py-3 rounded-xl text-xs font-bold text-gray-500 hover:text-white bg-transparent hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* EDIT MESSAGE DIALOG MODAL */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isEditingMsg && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsEditingMsg(false)} />
            
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative bg-[#09090b] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-white font-medium text-sm">
                  <span className="text-base">✏️</span>
                  <span>Edit Message</span>
                </div>
                <button 
                  onClick={() => setIsEditingMsg(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5 flex-1">
                <p className="text-[11px] text-gray-500 mb-2 font-medium">
                  Modify your query below. Saving will update this message in your chat:
                </p>
                <textarea
                  value={editingMsgContent}
                  onChange={(e) => setEditingMsgContent(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-gray-200 leading-relaxed font-sans focus:outline-none focus:border-[#00BFFF]/40 min-h-[140px] resize-y"
                />
              </div>
              
              <div className="px-5 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditingMsg(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditMessage}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* SELECT TEXT DIALOG MODAL */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isSelectTextOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsSelectTextOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative bg-[#09090b] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-white font-medium text-sm">
                  <span className="text-base">🔤</span>
                  <span>Select Text</span>
                </div>
                <button 
                  onClick={() => setIsSelectTextOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5 flex-1 overflow-y-auto">
                <p className="text-[11px] text-gray-500 mb-3 font-medium">
                  You can highlight and copy any portion of the text below:
                </p>
                <div 
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-gray-300 leading-relaxed font-sans select-all select-text overflow-y-auto max-h-[40vh] whitespace-pre-wrap break-words focus:outline-none"
                  tabIndex={0}
                >
                  {selectableText}
                </div>
              </div>
              
              <div className="px-5 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectableText);
                    addToast("Copied entire text to clipboard", "success");
                    setIsSelectTextOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  📋 Copy All
                </button>
                <button
                  onClick={() => setIsSelectTextOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* RENAME CHAT DIALOG MODAL */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isRenameOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsRenameOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative bg-[#09090b] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col z-10"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-white font-medium text-sm">
                  <span className="text-base">📝</span>
                  <span>Rename Conversation</span>
                </div>
                <button 
                  onClick={() => setIsRenameOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5 flex-1">
                <p className="text-[11px] text-gray-500 mb-2 font-medium">
                  Enter a new descriptive title for this conversation:
                </p>
                <input
                  type="text"
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-[#00BFFF]/40 font-sans"
                  placeholder="Conversation Title"
                  autoFocus
                />
              </div>
              
              <div className="px-5 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                <button
                  onClick={() => setIsRenameOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRenameSave}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Rename
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsDeleteConfirmOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative bg-[#09090b] border border-red-500/25 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col z-10"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-white font-medium text-sm">
                  <span className="text-base">🗑️</span>
                  <span>Delete Conversation?</span>
                </div>
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5 flex-1">
                <p className="text-xs text-gray-300 leading-relaxed">
                  Are you sure you want to permanently delete this conversation from your history? This action is irreversible.
                </p>
              </div>
              
              <div className="px-5 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (convToDeleteId) {
                      handleDeleteConversation(convToDeleteId);
                    }
                    setIsDeleteConfirmOpen(false);
                    setConvToDeleteId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 active:scale-95 text-white transition-all cursor-pointer"
                >
                  Yes, delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs for file pickers/triggers */}
      <input 
        type="file" 
        ref={imageInputRef} 
        onChange={handleImageSelect} 
        accept=".jpg,.jpeg,.png,.webp,image/*" 
        className="hidden" 
        multiple
      />

      <input 
        type="file" 
        ref={attachmentInputRef} 
        onChange={handleAttachmentSelect} 
        accept=".pdf,.docx,.doc,.txt,.zip,.csv,.pptx,.xlsx,.xls,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/zip,text/csv,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
        className="hidden" 
        multiple
      />

    </div>
  );
}
