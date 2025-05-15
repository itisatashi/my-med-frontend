import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Chip,
  Card,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
  HealthAndSafety as HealthIcon,
  MedicalServices as MedicalServicesIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getDoctorSpecialization,
  getSpecializationRussianName,
} from "../../data/doctors";

// Message interface
interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  attachments?: Array<{
    type: "image" | "document";
    url: string;
    name: string;
  }>;
  loading?: boolean;
  suggestions?: string[];
  doctorRecommendation?: {
    specialization: string;
    symptom: string;
  };
}

// Suggestion sets in Russian

const ChatInterface: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Здравствуйте! Я медицинский ассистент MedAssyst. Чем я могу вам помочь сегодня?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      text: "",
      timestamp: new Date(),
      loading: true,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInputValue("");
    setIsLoading(true);

    // Store the user query for potential fallback response
    const userQuery = userMessage.text;

    // We're only using Russian language

    // Set a timeout to handle API calls that take too long
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request Timeout")), 120000); // 120 second (2 minute) timeout for very slow laptop server
    });

    try {
      // Use our backend proxy to avoid CORS issues
      const response = (await Promise.race([
        fetch(
          // Use the backend proxy endpoint
          "https://my-med-backend.onrender.com/api/proxy",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: userQuery,
            }),
          }
        ),
        timeoutPromise,
      ])) as Response;

      if (response.ok) {
        // Successfully got response
        const data = await response.json();
        // Get response text from API
        const responseText =
          data.response ||
          "Извините, я не смог получить ответ. Пожалуйста, попробуйте еще раз.";

        // Choose a random Russian suggestion set

        // Try to determine if this is a medical symptom and find a specialist
        let doctorRecommendation: Message["doctorRecommendation"] = undefined;
        if (responseText.length > 20) {
          // Only analyze substantial responses
          // Extract likely symptoms from user query
          const potentialSymptoms = userQuery
            .split(/[,.;!?\s]+/)
            .filter((word) => word.length > 3);

          // Try to match each potential symptom with doctor specializations
          for (const symptom of potentialSymptoms) {
            const specialization = getDoctorSpecialization(symptom);
            if (specialization) {
              doctorRecommendation = {
                specialization,
                symptom,
              };
              break;
            }
          }

          // If no match from individual words, try the whole query
          if (!doctorRecommendation) {
            const specialization = getDoctorSpecialization(userQuery);
            if (specialization) {
              doctorRecommendation = {
                specialization,
                symptom: userQuery,
              };
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id
              ? {
                  ...msg,
                  text: responseText,
                  loading: false,
                  doctorRecommendation,
                }
              : msg
          )
        );
      } else {
        // Handle HTTP errors with fallback
        console.error(`API returned status ${response.status}`);
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error requesting AI response:", error);

      // Show error to user in UI
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Get a random Russian suggestion set

      // Create appropriate error message
      let errorText;
      if (
        (error instanceof TypeError && errorMessage.includes("fetch")) ||
        errorMessage === "Request Timeout"
      ) {
        // Connection issue
        errorText =
          "Возникла проблема с подключением к серверу или сервер отвечает медленно. Пожалуйста, попробуйте задать вопрос позже.";
      } else {
        // Other error
        errorText =
          "Произошла ошибка при получении ответа. Пожалуйста, попробуйте снова позже.";
      }

      // Update the message with the error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessage.id
            ? {
                ...msg,
                text: errorText,
                loading: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // In a real app, you would upload files to your server
    // For demo purposes, we'll just show a message
    const fileNames = Array.from(files)
      .map((file) => file.name)
      .join(", ");
    setInputValue((prev) =>
      prev ? `${prev} [Файл: ${fileNames}]` : `[Файл: ${fileNames}]`
    );
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);

    // Here you would integrate with the Web Speech API
    // For demo purposes, we'll just toggle a recording state
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("У меня болит голова и высокая температура");
      }, 3000);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Chat header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderRadius: "12px 12px 0 0",
          backgroundColor:
            theme.palette.mode === "dark" ? "background.paper" : "#f5f9fc",
          mb: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            color: "#fff",
            mr: 2,
            width: 40,
            height: 40,
          }}
        >
          <HealthIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Медицинский ассистент
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Онлайн • Отвечает мгновенно
          </Typography>
        </Box>
      </Paper>

      {/* Messages container */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "calc(100vh - 220px)",
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: message.sender === "user" ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                maxWidth: isMobile ? "90%" : "70%",
              }}
            >
              {message.sender === "ai" && (
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 32,
                    height: 32,
                    mr: 1,
                    mt: "auto",
                    mb: 1,
                  }}
                >
                  <HealthIcon fontSize="small" />
                </Avatar>
              )}

              <Card
                sx={{
                  maxWidth: "100%",
                  borderRadius:
                    message.sender === "user"
                      ? "12px 12px 0 12px"
                      : "12px 12px 12px 0",
                  backgroundColor:
                    message.sender === "user"
                      ? "primary.main"
                      : theme.palette.mode === "dark"
                      ? "background.paper"
                      : "#f5f9fc",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                {message.loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <Box sx={{ p: 2 }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.text}
                    </ReactMarkdown>

                    {/* Doctor recommendation if available */}
                    {message.sender === "ai" &&
                      message.doctorRecommendation && (
                        <Box sx={{ mt: 2 }}>
                          <Alert
                            severity="info"
                            icon={<MedicalServicesIcon />}
                            sx={{
                              borderRadius: 2,
                              "& .MuiAlert-message": { width: "100%" },
                            }}
                          >
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Рекомендация специалиста
                            </Typography>
                            <Typography variant="body2" paragraph>
                              По вашим симптомам, рекомендуем консультацию у
                              специалиста:{" "}
                              <b>
                                {getSpecializationRussianName(
                                  message.doctorRecommendation.specialization ||
                                    ""
                                )}
                              </b>
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              endIcon={<ArrowForwardIcon />}
                              onClick={() =>
                                navigate(
                                  `/consult?specialization=${
                                    message.doctorRecommendation
                                      ?.specialization || ""
                                  }`
                                )
                              }
                              sx={{ borderRadius: 4 }}
                            >
                              Найти врача
                            </Button>
                          </Alert>
                        </Box>
                      )}
                  </Box>
                )}
              </Card>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  display: "block",
                  textAlign: message.sender === "user" ? "right" : "left",
                  ml: message.sender === "user" ? 1 : 0,
                  mr: message.sender === "ai" ? 1 : 0,
                }}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>

            {/* Suggested responses */}
            {message.sender === "ai" &&
              message.suggestions &&
              message.suggestions.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1,
                    maxWidth: "90%",
                  }}
                >
                  {message.suggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      onClick={() => {
                        setInputValue(suggestion);
                        // Use setTimeout to ensure the input value is set before sending
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      sx={{
                        cursor: "pointer",
                        bgcolor: "background.paper",
                      }}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        sx={{
          p: 2,
          bgcolor:
            theme.palette.mode === "dark" ? "background.paper" : "#f5f9fc",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            size="small"
            onClick={handleAttachFile}
            disabled={isLoading}
            sx={{ mr: 1 }}
          >
            <AttachFileIcon />
          </IconButton>

          <TextField
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите ваше сообщение..."
            multiline
            maxRows={4}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  color={isRecording ? "error" : "default"}
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                >
                  <MicIcon />
                </IconButton>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            sx={{
              ml: 1,
              borderRadius: 3,
              minWidth: 100,
            }}
          >
            Отправить
          </Button>

          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            style={{ display: "none" }}
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;
