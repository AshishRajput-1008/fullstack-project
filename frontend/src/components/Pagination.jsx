
export default function Pagination({ page=1, pages=1, onPageChange=()=>{} }) {
  if (pages <= 1) return null;
  const arr = Array.from({ length: pages }, (_, i) => i+1);
  return (
    <div className="flex gap-2">
      {arr.map(p => (
        <button key={p} onClick={()=>onPageChange(p)} className={`px-3 py-1 rounded ${p===page ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>{p}</button>
      ))}
    </div>
  );
}
