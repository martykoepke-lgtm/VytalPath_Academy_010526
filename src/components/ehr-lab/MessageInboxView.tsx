import { useState } from 'react';
import {
  Plus,
  Mail,
  MailOpen,
  Archive,
  Send,
  X,
  AlertCircle,
  ArrowUpCircle,
  FileText,
  Pill,
  ClipboardList,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { useEHRSession } from './EHRSessionContext';
import type { EHRMessage, MessageType, MessagePriority } from '../../types/ehr';

interface MessageInboxViewProps {
  onOpenChart?: (patientId: string) => void;
}

const typeIcons: Record<MessageType, typeof Mail> = {
  result: FlaskConical,
  referral: FileText,
  'rx-refill': Pill,
  general: MessageSquare,
  task: ClipboardList,
};

// Redefine so we don't need an extra import
function FlaskConical(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/>
      <path d="M8.5 2h7"/>
      <path d="M7 16.5h10"/>
    </svg>
  );
}

const typeLabels: Record<MessageType, string> = {
  result: 'Lab Result',
  referral: 'Referral',
  'rx-refill': 'Rx Refill',
  general: 'General',
  task: 'Task',
};

const priorityBadges: Record<MessagePriority, string> = {
  normal: '',
  high: 'bg-orange-50 text-orange-700',
  urgent: 'bg-red-50 text-red-700',
};

type FilterTab = 'all' | 'unread' | 'archived';

export function MessageInboxView({ onOpenChart }: MessageInboxViewProps) {
  const { messages, getPatient, markMessageRead, archiveMessage, addMessage, getUnreadMessageCount } = useEHRSession();
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  // Compose state
  const [composeTo, setComposeTo] = useState('Dr. Sarah Chen');
  const [composeSubject, setComposeSubject] = useState('');
  const [composePriority, setComposePriority] = useState<MessagePriority>('normal');
  const [composeBody, setComposeBody] = useState('');

  const filteredMessages = messages
    .filter((m) => {
      if (filterTab === 'unread') return m.status === 'unread';
      if (filterTab === 'archived') return m.status === 'archived';
      return m.status !== 'archived';
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const selected = selectedId ? messages.find((m) => m.id === selectedId) : null;

  const handleSelectMessage = (msg: EHRMessage) => {
    setSelectedId(msg.id);
    if (msg.status === 'unread') {
      markMessageRead(msg.id);
    }
  };

  const handleSendMessage = () => {
    if (!composeSubject.trim() || !composeBody.trim()) return;
    addMessage({
      type: 'general',
      from: 'Front Desk',
      to: composeTo,
      subject: composeSubject,
      body: composeBody,
      patientId: null,
      priority: composePriority,
      status: 'read',
    });
    setShowCompose(false);
    setComposeSubject('');
    setComposeBody('');
    setComposePriority('normal');
  };

  const unreadCount = getUnreadMessageCount();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div>
      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
              <button onClick={() => setShowCompose(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                <select
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>Dr. Sarah Chen</option>
                  <option>Front Desk</option>
                  <option>Medical Assistant</option>
                  <option>Lab</option>
                  <option>Billing</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
                <div className="flex gap-2">
                  {(['normal', 'high', 'urgent'] as MessagePriority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setComposePriority(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                        composePriority === p
                          ? p === 'urgent' ? 'bg-red-600 text-white' : p === 'high' ? 'bg-orange-500 text-white' : 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Message</label>
                <textarea
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Type your message..."
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setShowCompose(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!composeSubject.trim() || !composeBody.trim()}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main layout: list + detail */}
      <div className="flex gap-4 min-h-[500px]">
        {/* Message list */}
        <div className="w-[340px] flex-shrink-0 bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden flex flex-col">
          {/* Filter tabs + compose */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
            <div className="flex items-center gap-1">
              {(['all', 'unread', 'archived'] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                    filterTab === tab ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab} {tab === 'unread' && unreadCount > 0 && `(${unreadCount})`}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCompose(true)}
              className="p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
              title="Compose"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Message rows */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No messages</div>
            ) : (
              filteredMessages.map((msg) => {
                const patient = msg.patientId ? getPatient(msg.patientId) : null;
                const isUnread = msg.status === 'unread';
                const isSelected = selectedId === msg.id;
                const TypeIcon = typeIcons[msg.type] || MessageSquare;

                return (
                  <button
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`w-full text-left px-3 py-2.5 border-b border-gray-100 transition-colors ${
                      isSelected ? 'bg-teal-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TypeIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isUnread ? 'text-teal-600' : 'text-gray-400'}`} />
                      <span className={`text-xs flex-1 truncate ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        {msg.from}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                    </div>
                    <p className={`text-sm truncate mt-0.5 ${isUnread ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {msg.subject}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {patient && (
                        <span className="text-xs text-gray-400 truncate">
                          {patient.demographics.lastName}, {patient.demographics.firstName}
                        </span>
                      )}
                      {msg.priority !== 'normal' && (
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${priorityBadges[msg.priority]}`}>
                          {msg.priority}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message detail */}
        <div className="flex-1 bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
          {selected ? (
            <div className="h-full flex flex-col">
              {/* Detail header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{selected.subject}</h3>
                  {selected.priority !== 'normal' && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityBadges[selected.priority]}`}>
                      {selected.priority === 'urgent' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                      {selected.priority === 'high' && <ArrowUpCircle className="w-3 h-3 inline mr-1" />}
                      {selected.priority}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>From: {selected.from}</span>
                  <span>To: {selected.to}</span>
                  <span>{new Date(selected.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                </div>
                {selected.patientId && (() => {
                  const pt = getPatient(selected.patientId);
                  return pt ? (
                    <p className="text-xs text-gray-400 mt-1">
                      Patient: {pt.demographics.lastName}, {pt.demographics.firstName} ({pt.mrn})
                    </p>
                  ) : null;
                })()}
              </div>

              {/* Body */}
              <div className="flex-1 px-6 py-4 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.body}</p>
              </div>

              {/* Actions */}
              <div className="px-6 py-3 border-t border-gray-200 flex items-center gap-2">
                <button
                  onClick={() => setShowCompose(true)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-teal-700 border border-teal-300 hover:bg-teal-50 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
                {selected.patientId && onOpenChart && (
                  <button
                    onClick={() => onOpenChart(selected.patientId!)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-blue-700 border border-blue-300 hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Open Chart
                  </button>
                )}
                {selected.status !== 'archived' && (
                  <button
                    onClick={() => { archiveMessage(selected.id); setSelectedId(null); }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Archive
                  </button>
                )}
                <div className="flex-1" />
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  {selected.status === 'read' && <><MailOpen className="w-3 h-3" /> Read</>}
                  {selected.status === 'archived' && <><CheckCircle className="w-3 h-3" /> Archived</>}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Mail className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
