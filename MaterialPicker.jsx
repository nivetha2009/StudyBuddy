import { Link } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';
import { useStudy } from '../context/StudyContext.jsx';

/**
 * Lets a student choose which uploaded document the AI should work from.
 * "No material" means the AI answers from general knowledge instead.
 */
export default function MaterialPicker({ label = 'Study material', allowNone = true }) {
  const { materials, activeMaterialId, setActiveMaterialId } = useStudy();

  if (!materials.length) {
    return (
      <div className="card-quiet flex flex-wrap items-center gap-3 p-4">
        <FileText size={18} className="text-muted" />
        <p className="flex-1 text-[15px] text-muted">No material uploaded yet. StudyBuddy will use general knowledge.</p>
        <Link to="/materials" className="btn btn-secondary btn-sm">
          <Upload size={15} /> Upload a file
        </Link>
      </div>
    );
  }

  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-semibold text-muted">{label}</span>
      <select
        className="field"
        value={activeMaterialId || ''}
        onChange={(event) => setActiveMaterialId(event.target.value || null)}
      >
        {allowNone && <option value="">General knowledge (no material)</option>}
        {materials.map((material) => (
          <option key={material.id} value={material.id}>
            {material.name}
          </option>
        ))}
      </select>
    </label>
  );
}
