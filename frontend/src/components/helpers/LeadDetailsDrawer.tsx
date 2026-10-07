import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { X, Upload, Image, FileText, FileSpreadsheet, FileArchive, File } from "lucide-react";
import type { Lead } from "./LeadCard";

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface Comment {
  id: string;
  author: string;
  createdAt: string;
  content: string;
  attachments?: Attachment[];
}

interface LeadDetailsDrawerProps {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
}

export function LeadDetailsDrawer({ open, lead, onClose }: LeadDetailsDrawerProps) {
  const [activity, setActivity] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      // Reset state when lead changes; in real app, populate from API
      setActivity("");
      setAttachments([]);
      setComments([]);
      setError(null);
    }
  }, [lead]);

  if (!open || !lead) return null;

  const platform = "Contact Us";
  const country = "India";
  const city = "Pune";
  const companyName = "Rslsolution";
  const industry = "Software";
  const purpose = "";
  const createdDate = "01-23-2026";
  const assignDate = "01-23-2026, 16:59";

  const getFileIcon = (file: Attachment) => {
    const type = file.type.toLowerCase();
    if (type.startsWith("image/")) return <Image className="w-3.5 h-3.5 text-orange-500" />;
    if (type.includes("spreadsheet") || type.includes("excel") || type.endsWith("xls") || type.endsWith("xlsx")) {
      return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />;
    }
    if (type.includes("pdf") || type.includes("text") || type.includes("word") || type.includes("presentation")) {
      return <FileText className="w-3.5 h-3.5 text-sky-500" />;
    }
    if (type.includes("zip") || type.includes("rar") || type.includes("archive")) {
      return <FileArchive className="w-3.5 h-3.5 text-purple-500" />;
    }
    return <File className="w-3.5 h-3.5 text-slate-500" />;
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const newAttachments: Attachment[] = [];
    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        setError("Each file must be smaller than 5MB.");
        continue;
      }
      newAttachments.push({
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        size: file.size,
        type: file.type || file.name.split(".").pop() || "file"
      });
    }
    if (newAttachments.length) {
      setAttachments(prev => [...prev, ...newAttachments]);
      setError(null);
    }
    // Reset input so same file can be selected again
    event.target.value = "";
  };

  const handlePostComment = () => {
    if (!activity || activity.trim() === "" || activity === "<p><br></p>") {
      setError("Please write a comment before posting.");
      return;
    }
    const now = new Date();
    const createdAt = now.toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const currentAttachments = attachments;
    const newComment: Comment = {
      id: String(now.getTime()),
      author: "You",
      createdAt,
      content: activity,
      attachments: currentAttachments
    };
    setComments(prev => [newComment, ...prev]);
    setActivity("");
    setAttachments([]);
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-full bg-white dark:bg-slate-950 shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Lead Overview
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {lead.subject}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300"
            aria-label="Close lead details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <h3 className="text-sm font-semibold text-orange-600 mb-3">
                Client Details
              </h3>
              <dl className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Name:</dt>
                  <dd className="text-right">{lead.name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Email:</dt>
                  <dd className="text-right">N/A</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Phone:</dt>
                  <dd className="text-right">N/A</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Company:</dt>
                  <dd className="text-right">{lead.company}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Lead Ownership:</dt>
                  <dd className="text-right">{lead.assignee}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <h3 className="text-sm font-semibold text-orange-600 mb-3">
                Other Details
              </h3>
              <dl className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Platform:</dt>
                  <dd className="text-right">{platform || "N/A"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Country:</dt>
                  <dd className="text-right">{country || "N/A"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">City:</dt>
                  <dd className="text-right">{city || "N/A"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Company Name:</dt>
                  <dd className="text-right">{companyName || "N/A"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Industry:</dt>
                  <dd className="text-right">{industry || "N/A"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Purpose:</dt>
                  <dd className="text-right">{purpose || "N/A"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Created Date:</dt>
                  <dd className="text-right">{createdDate || "N/A"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">Assign Date:</dt>
                  <dd className="text-right">{assignDate || "N/A"}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-orange-600 mb-3">
                  Lead Quality
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                  Adjust the quality based on discussions and engagement.
                </p>
                <input
                  type="range"
                  min={0}
                  max={100}
                  className="w-full accent-orange-500"
                />
              </div>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Current: <span className="font-semibold">{lead.leadQuality || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <h3 className="text-sm font-semibold text-orange-600 mb-3">
              Description
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              We are seeking to partner with established software development companies and agencies for
              immediate project collaboration. Ideal partners should have strong technical expertise and a
              proven delivery track record. This section can be replaced with the actual lead description
              content when connected to the backend.
            </p>
          </div>

          {/* Activity + attachments + comments */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-orange-600">
                Activity
              </h3>
            </div>

            <div className="lead-activity-editor bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 mb-4">
              <ReactQuill
                theme="snow"
                value={activity}
                onChange={setActivity}
                className="rounded-lg"
                placeholder="Write an update or comment..."
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFilesChange}
                    accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                  />
                  <span className="w-7 h-7 rounded-full border border-orange-500 text-orange-500 flex items-center justify-center bg-white dark:bg-slate-950">
                    <Upload className="w-3 h-3" />
                  </span>
                  <span>
                    Upload files (max 5MB)
                    <span className="block text-[10px] text-slate-400">
                      Images, PDF, Office docs, text
                    </span>
                  </span>
                </label>
              </div>

              <button
                type="button"
                onClick={handlePostComment}
                className="mt-2 sm:mt-0 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium"
              >
                Post Comment
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}

            {attachments.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Attachments
                </h4>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {attachments.map(file => (
                    <li key={file.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                          {getFileIcon(file)}
                        </div>
                        <span className="truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setAttachments(prev => prev.filter(att => att.id !== file.id))
                          }
                          className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          aria-label="Remove attachment"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Comments
              </h4>
              {comments.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No comments found.
                </p>
              ) : (
                <div className="space-y-3">
                  {comments.map(comment => (
                    <div
                      key={comment.id}
                      className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                          {comment.author}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {comment.createdAt}
                        </span>
                      </div>
                      <div
                        className="prose prose-sm max-w-none text-slate-700 dark:text-slate-200"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                      />
                      {comment.attachments && comment.attachments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            Attachments
                          </p>
                          <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                            {comment.attachments.map(file => (
                              <li key={file.id} className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                  {getFileIcon(file)}
                                </div>
                                <span className="truncate">{file.name}</span>
                                <span className="text-slate-400">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

