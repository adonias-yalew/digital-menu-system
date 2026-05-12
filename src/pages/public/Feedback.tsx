import { useState, useEffect } from "react";

import { Star, Send, MessageSquare, CheckCircle2, Loader2, TrendingUp, Users, Clock } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";
import { createFeedback, getFeedbacks, getFeedbackStats } from "@/services/feedbackService";
import { Feedback as FeedbackType } from "@/types/menu";
import { sanitizeName, sanitizeEmail, sanitizeMessage, sanitizeRating } from "@/utils/sanitize";
import { debugFeedbackSystem } from "@/utils/feedbackDebug";

const ratingLabels = [
  "feedback.poor",
  "feedback.fair",
  "feedback.good",
  "feedback.veryGood",
  "feedback.excellent",
] as const;

export default function Feedback() {
  const { t } = useLanguage();

  const [rating, setRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  // Input handlers with real-time sanitization
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeName(e.target.value);
    setName(sanitized);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeEmail(e.target.value);
    setEmail(sanitized);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitized = sanitizeMessage(e.target.value);
    setMessage(sanitized);
  };

  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // New states for statistics and existing feedback
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Load feedback statistics and existing feedback
  useEffect(() => {
    const loadData = async () => {
      try {
        // Debug feedback system
        await debugFeedbackSystem();
        
        const [feedbacksData, statsData] = await Promise.all([
          getFeedbacks(),
          getFeedbackStats()
        ]);
        
        console.log('Total feedbacks loaded:', feedbacksData.length);
        console.log('Setting feedbacks to first 2:', feedbacksData.slice(0, 2));
        setFeedbacks(feedbacksData.slice(0, 2)); // Show latest 2 feedbacks
        setStats(statsData);
      } catch (error) {
        console.error('Error loading feedback data:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submitting feedback:', { name, message: message.trim(), rating });

    if (!message.trim() || rating === 0) {
      console.log('Validation failed:', { 
        hasMessage: !!message.trim(), 
        hasRating: rating > 0 
      });
      return;
    }

    setSubmitting(true);

    try {
      // Sanitize all inputs before submission
      const sanitizedData = {
        customer_name: sanitizeName(name) || 'Anonymous',
        message: sanitizeMessage(message),
        rating: sanitizeRating(rating),
      };

      console.log('Sanitized data:', sanitizedData);

      // Validate sanitized data
      if (!sanitizedData.message || sanitizedData.rating === 0) {
        console.error('Invalid sanitized data');
        setSubmitting(false);
        return;
      }

      const result = await createFeedback(sanitizedData);
      console.log('Feedback created successfully:', result);
      
      // Refresh feedback data
      const [feedbacksData, statsData] = await Promise.all([
        getFeedbacks(),
        getFeedbackStats()
      ]);
      console.log('After submission - Total feedbacks:', feedbacksData.length);
      console.log('After submission - Setting feedbacks to first 2:', feedbacksData.slice(0, 2));
      setFeedbacks(feedbacksData.slice(0, 2));
      setStats(statsData);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`Failed to submit feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  const reset = () => {
    setSubmitted(false);

    setRating(0);

    setName("");

    setEmail("");

    setMessage("");
  };

  // ========================
  // SUCCESS SCREEN
  // ========================
  if (submitted) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-4 pb-24">
        <div className="w-full rounded-[30px] border border-red-100 bg-white p-7 text-center shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-50">
            <CheckCircle2 className="h-10 w-10 text-primary" strokeWidth={1.7} />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
            Feedback Send
          </h2>

          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t("feedback.thankYouSub")}
          </p>

          <button
            onClick={reset}
            className="mt-7 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.99]"
          >
            {t("feedback.sendAnother")}
          </button>
        </div>
      </div>
    );
  }

  // ========================
  // MAIN PAGE
  // ========================
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background px-4 pt-5 pb-28">
      {/* HEADER */}
      <div className="rounded-[30px] border border-red-100 bg-gradient-to-br from-white to-red-50/60 p-5 shadow-[0_6px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-sm">
            <MessageSquare className="h-5 w-5" strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {t("feedback.title")}
            </h1>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t("feedback.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* RANKING STATISTICS */}
      {!loadingStats && (
        <div className="mt-5 space-y-4">
          <div className="rounded-[28px] border border-red-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-semibold text-foreground mb-4">Customer Ratings</h3>
            
            {/* Rating Overview */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-foreground">{stats.average.toFixed(1)}</div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(stats.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                      strokeWidth={1.7}
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Reviews</div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const percentage = stats.total > 0 ? (stats.distribution[rating as keyof typeof stats.distribution] / stats.total) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-xs font-medium">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {stats.distribution[rating as keyof typeof stats.distribution]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Feedback */}
          {feedbacks.length > 0 && (
            <div className="rounded-[28px] border border-red-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h3 className="text-sm font-semibold text-foreground mb-4">Recent Reviews ({feedbacks.length})</h3>
              <div className="space-y-3">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {feedback.customer_name || 'Anonymous'}
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                                strokeWidth={1.7}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(feedback.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{feedback.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* RATING */}
        <div className="rounded-[28px] border border-red-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <label className="text-sm font-semibold text-foreground">
            {t("feedback.ratingLabel")}
          </label>

          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 transition ${
                    star <= (hoverRating || rating) ? "fill-primary text-primary" : "text-red-100"
                  }`}
                  strokeWidth={1.7}
                />
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs font-medium text-muted-foreground">
            {rating > 0 ? t(ratingLabels[rating - 1]) : t("feedback.ratingHint")}
          </p>
        </div>

        {/* NAME */}
        <div className="rounded-[28px] border border-red-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <label className="text-sm font-semibold text-foreground">
            {t("feedback.name")}

            <span className="ml-1 font-normal text-muted-foreground">
              ({t("feedback.optional")})
            </span>
          </label>

          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Your name"
            className="mt-3 w-full rounded-2xl border border-red-100 bg-red-50/30 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white"
          />
        </div>

        {/* EMAIL */}
        <div className="rounded-[28px] border border-red-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <label className="text-sm font-semibold text-foreground">
            {t("feedback.email")}

            <span className="ml-1 font-normal text-muted-foreground">
              ({t("feedback.optional")})
            </span>
          </label>

          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="your@email.com"
            className="mt-3 w-full rounded-2xl border border-red-100 bg-red-50/30 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white"
          />
        </div>

        {/* MESSAGE */}
        <div className="rounded-[28px] border border-red-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <label className="text-sm font-semibold text-foreground">
            {t("feedback.message")}

            <span className="ml-1 text-primary">*</span>
          </label>

          <textarea
            required
            rows={5}
            value={message}
            onChange={handleMessageChange}
            placeholder="Tell us about your experience..."
            className="mt-3 w-full resize-none rounded-2xl border border-red-100 bg-red-50/30 px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-primary focus:bg-white"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={submitting || !message.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-primary py-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
        >
          <Send className="h-4 w-4" strokeWidth={1.8} />

          {submitting ? t("feedback.sending") : t("feedback.send")}
        </button>
      </form>
    </div>
  );
}
