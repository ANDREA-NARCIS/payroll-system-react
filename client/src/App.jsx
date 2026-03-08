import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer;

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/payroll");
        const json = await res.json();
        if (!cancelled && json) {
          setData(json);
        } else if (!cancelled) {
          timer = setTimeout(fetchData, 2000);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // ─── Error State ───────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center font-serif">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-sm">
          <p className="text-4xl mb-4">😵</p>
          <h2 className="text-2xl text-name-red mb-2">Connection Error</h2>
          <p className="text-gray-400 text-lg mb-6">Could not reach the payroll server.</p>
          <button
            onClick={() => { setError(false); window.location.reload(); }}
            className="px-6 py-2.5 bg-card-teal text-white rounded-xl text-lg hover:bg-card-teal-dark transition-colors duration-300 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Loading State ─────────────────────────────────────
  if (!data) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center font-serif">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="relative w-14 h-14 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-card-teal animate-spin"></div>
          </div>
          <h2 className="text-2xl text-gray-800">Loading Payroll...</h2>
        </div>
      </div>
    );
  }

  // ─── Format helpers ────────────────────────────────────
  const fmt = (n) => Number(n).toLocaleString("en-IN");

  // ─── Dashboard ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 font-serif">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xl text-gray-800 leading-tight">
            Employee Dashboard for
          </p>
          <p className="text-xl text-name-red">{data.name}</p>
        </div>

        {/* Teal inner card */}
        <div className="bg-card-teal rounded-3xl px-8 py-10 text-center">
          {/* Position */}
          <h2 className="text-white text-4xl mb-4 italic">
            {data.position}
          </h2>

          {/* Gross Salary */}
          <p className="text-white/90 text-4xl mb-1">
            <span className="text-3xl">₹</span>{fmt(data.salary)}
          </p>

          {/* Tax */}
          <p className="text-emerald-300 text-xl mb-3">
            -18%
          </p>

          {/* Net Salary */}
          <p className="text-salary-green text-6xl font-normal">
            <span className="text-5xl">₹</span>{fmt(data.netSalary)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;