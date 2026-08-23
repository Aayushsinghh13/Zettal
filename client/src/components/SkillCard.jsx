import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import UserAvatar from './UserAvatar';
import SkillBadge from './SkillBadge';

const SkillCard = ({ listing, index = 0 }) => {
  const navigate = useNavigate();
  const { _id, title, description, skillName, category, postedBy } = listing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => navigate(`/listings/${_id}`)}
      className="group bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wide">
          {category}
        </span>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
          <Star size={12} fill="currentColor" />
          {postedBy?.rating?.toFixed(1) || 'NEW'}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight tracking-tight group-hover:text-primary-600 transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-5 flex-1">
        {description}
      </p>

      <div className="mb-5">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold bg-primary-50 text-primary-700 border border-primary-100">
          {skillName}
        </span>
      </div>
      
      <div className="border-t border-slate-100 pt-5 mt-auto">
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar name={postedBy?.name} avatar={postedBy?.avatar} size="sm" />
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none mb-1">{postedBy?.name}</p>
              {postedBy?.location && (
                <p className="text-xs text-slate-500 font-medium flex items-center gap-0.5">
                  <MapPin size={10} className="text-slate-400" /> {postedBy.location}
                </p>
              )}
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-sm font-bold text-primary-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            View <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillCard;
