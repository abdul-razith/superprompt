
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PromptHistoryEntry } from '@/services/supabasePromptService';

const PromptLibrary = () => {
  const { promptHistory, loadSession } = useWorkspace();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredHistory = promptHistory.filter(entry =>
    entry.lazyPrompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadSession = (session: PromptHistoryEntry) => {
    loadSession(session);
    navigate('/workspace');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Prompt Library</h1>
            <Button onClick={() => navigate('/workspace')}>Back to Workspace</Button>
        </div>

        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search your prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map(entry => (
              <Card 
                key={entry.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleLoadSession(entry)}
              >
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-2 truncate">{entry.lazyPrompt}</h3>
                  <p className="text-sm text-gray-600 truncate mb-3 h-5">
                    {Object.values(entry.generatedSuperPrompts || {})[0] || 'No super prompt generated yet.'}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                    <span>{new Date(entry.createdAt).toLocaleString()}</span>
                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{entry.purposeType}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-gray-500">No prompts found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptLibrary;
