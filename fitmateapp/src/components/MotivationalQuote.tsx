import { useEffect, useState } from "react";
import axios from "axios";

const MotivationalQuote = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await axios.get(
          "https://api.allorigins.win/get?url=" +
            encodeURIComponent("https://zenquotes.io/api/today")
        );
        const contents = JSON.parse(res.data.contents);
        const quoteData = contents[0];
        setQuote(quoteData.q);
        setAuthor(quoteData.a);
      } catch (err) {
        setQuote(
          "Push yourself, because no one else is going to do it for you."
        );
        setAuthor("Unknown");
      }
    };

    fetchQuote();
  }, []);

  return (
    <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg col-span-1 md:col-span-2 row-span-1 min-h-[200px] flex items-center justify-center">
      <div className="text-center max-w-xl">
        <blockquote className="text-3xl italic mb-4 leading-relaxed">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <p className="text-x1 text-gray-400">— {author}</p>
      </div>
    </div>
  );
};

export default MotivationalQuote;
