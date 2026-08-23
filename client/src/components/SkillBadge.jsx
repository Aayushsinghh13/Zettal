import { X } from 'lucide-react';

const levelColors = {
  Beginner:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border border-amber-200',
  Advanced:     'bg-primary-50 text-primary-700 border border-primary-200',
};

const SkillBadge = ({ label, level, removable = false, onRemove }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${levelColors[level] || 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
    {label}
    {level && (
      <span className="opacity-60 font-semibold">· {level}</span>
    )}
    {removable && (
      <button onClick={onRemove} className="ml-0.5 hover:opacity-80 transition-opacity" aria-label={`Remove ${label}`}>
        <X size={10} />
      </button>
    )}
  </span>
);

export default SkillBadge;
