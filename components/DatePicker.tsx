import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function MyDatePicker({ 
  selected, 
  onChange 
}: { 
  selected: Date; 
  onChange: (date: Date) => void 
}) {
  const handleChange = (date: Date | null) => {
    if (date) {
      onChange(date);
    }
  };

  return (
    <DatePicker
      selected={selected}
      onChange={handleChange}
      dateFormat="MMMM d, yyyy"
      className="w-full rounded-md border border-input bg-background px-3 py-2"
    />
  );
}
