interface WidgetProps {
  title: string;
  value: string;
}

const Widget = ({ title, value }: WidgetProps) => {
  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-lg transition">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default Widget;
