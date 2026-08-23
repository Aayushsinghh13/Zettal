import { X } from 'lucide-react';

const SkillBadge = ({ label, removable = false, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#FCD34D' }}>
    {label}
    {removable && (
      <button onClick={onRemove} className="ml-0.5 hover:text-gold-300 transition-colors" aria-label={`Remove ${label}`}>
        <X size={10} />
      </button>
    )}
  </span>
);

export default SkillBadge;
