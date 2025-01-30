import React, { useState } from 'react';
import { Bot, Code, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import axios from 'axios';

const ChatbotDashboard = () => {
  const [botStatus, setBotStatus] = useState(true);
  const [processedDocuments, setProcessedDocuments] = useState(0);
  const [registeredAPIs, setRegisteredAPIs] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [documentStatus, setDocumentStatus] = useState('idle');
  const [swaggerStatus, setSwaggerStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleFileUpload = async (type, file) => {
    const statusSetter = type === 'document' ? setDocumentStatus : setSwaggerStatus;
    statusSetter('uploading');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const endpoint = type === 'document' 
        ? 'http://localhost:3001/api/document' 
        : 'http://localhost:3001/api/swagger';

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (type === 'document') {
        setProcessedDocuments(prev => prev + 1);
      } else {
        setRegisteredAPIs(prev => prev + 1);
      }

      statusSetter('success');
      setTimeout(() => statusSetter('idle'), 3000);
    } catch (err) {
      statusSetter('error');
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newHistory = [...chatHistory, { type: 'user', content: message }];
    setChatHistory(newHistory);
    
    try {
      let response;
      if (message.startsWith('/action ')) {
        const [_, apiName, path, method] = message.split(' ');
        response = await axios.post('http://localhost:3001/api/perform-action', {
          apiName,
          path,
          method
        });
      } else {
        response = await axios.post('http://localhost:3001/api/ask', {
          question: message
        });
      }

      setChatHistory([...newHistory, { 
        type: 'bot', 
        content: response.data.answer || JSON.stringify(response.data, null, 2) 
      }]);
    } catch (err) {
      setChatHistory([...newHistory, { 
        type: 'error', 
        content: err.response?.data?.error || 'Failed to get response' 
      }]);
    }

    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Chatbot Admin Dashboard</h1>
            <p className="text-gray-500">Manage your AI chatbot settings and monitor performance</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Bot Status:</span>
            <Switch checked={botStatus} onCheckedChange={setBotStatus} />
            <span className={`text-sm font-medium ${botStatus ? 'text-green-500' : 'text-gray-400'}`}>
              {botStatus ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Processed Documents</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processedDocuments}</div>
            </CardContent>
          </Card>
          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Registered APIs</CardTitle>
              <Code className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registeredAPIs}</div>
            </CardContent>
          </Card>
          <Card className="">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Response Accuracy</CardTitle>
              <Bot className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.2%</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chat">Chat Interface</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="swagger">Swagger</TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card className="">
              <CardHeader>
                <CardTitle>Chat Interface</CardTitle>
                <CardDescription>Interact with your AI assistant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-lg ${msg.type === 'user' ? 'ml-auto bg-blue-100 w-3/4' : 'bg-gray-100 w-3/4'}`}>
                      <div className="text-sm text-gray-500">
                        {msg.type === 'user' ? 'You' : 'Assistant'}
                      </div>
                      <div className="mt-1 whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question or type /action [api] [path] [method]"
                  />
                  <Button type="submit">Send</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge">
            <Card className="">
              <CardHeader>
                <CardTitle>Knowledge Base Management</CardTitle>
                <CardDescription>Upload documents to enhance chatbot knowledge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="document-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => e.target.files[0] && handleFileUpload('document', e.target.files[0])}
                  />
                  <label 
                    htmlFor="document-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <FileText className="h-8 w-8 text-gray-500" />
                    <p className="text-sm text-gray-500">
                      {documentStatus === 'uploading' ? 'Uploading...' : 
                       documentStatus === 'success' ? 'Upload Successful!' : 
                       'Drag & drop or click to upload'}
                    </p>
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Management Tab */}
          <TabsContent value="apis">
            <Card className="">
              <CardHeader>
                <CardTitle>API Management</CardTitle>
                <CardDescription>Upload Swagger files to enable API actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="swagger-upload"
                    className="hidden"
                    accept=".yaml,.json"
                    onChange={(e) => e.target.files[0] && handleFileUpload('swagger', e.target.files[0])}
                  />
                  <label 
                    htmlFor="swagger-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <Code className="h-8 w-8 text-gray-500" />
                    <p className="text-sm text-gray-500">
                      {swaggerStatus === 'uploading' ? 'Uploading...' : 
                       swaggerStatus === 'success' ? 'Upload Successful!' : 
                       'Drag & drop or click to upload Swagger'}
                    </p>
                  </label>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChatbotDashboard;