interface InfoCardProps {
  title: string;
  content: string;
}

function InfoCard({ title, content }: InfoCardProps) {
  return (
    <div className="p-2 rounded border border-[#2a2a2b] bg-[#181818]">
      <p className="font-semibold text-xs uppercase text-zinc-400 tracking-wider pb-1">
        {title}
      </p>
      <p className="text-base text-zinc-100">{content}</p>
    </div>
  );
}

export default InfoCard;
