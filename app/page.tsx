
export default function Home() {
  return (
    <div>
      <main className="bg-[#2C191D] w-full h-screen font-courier-prime grid place-content-center">
        <div className="relative bg-[#FDFBF5] border-2 border-[#2C191D] w-full shadow-boxes-big shadow-[#D36951] p-10">
          <div className="flex flex-col items-center gap-y-4">
            <h1 className="font-bevan font-black text-4xl italic">Groove Keeper</h1>
            <span className="uppercase text-xs font-bold text-[#BD5740] leading-1.5 tracking-widest">staff access only</span>
          </div>
          <div className="flex flex-col gap-y-4 pt-10">
            <div>
              <label className="text-xs tracking-widest font-bold uppercase text-[#5B4C4F] flex flex-col gap-y-2">
                email
                <input className="text-[#2C191D] text-sm bg-[#F5F1DE] border-2 border-[#2C191D] p-3 w-80" type="email" placeholder="your@groovekeeper.com" />
              </label>
            </div>
            <div>
              <label className="text-xs tracking-widest font-bold uppercase text-[#5B4C4F] flex flex-col gap-y-2">
                password
                <input className="text-[#2C191D] text-sm bg-[#F5F1DE] border-2 border-[#2C191D] p-3 w-80" type="password" placeholder="••••••" />
              </label>
            </div>
            <a href="#" className="uppercase text-xs font-bold text-[#BD5740] leading-1.5 tracking-widest text-right underline pt-4">forgot password?</a>
            <button className="cursor-pointer mt-6 w-fit px-6 text-md py-2 bg-[#BD5740] uppercase text-[#F5F1DE] mx-auto border-2 border-[#2C191D] shadow-boxes-small shadow-[#2C191D]">log in</button>
          </div>
          <span className="absolute top-0 right-10 -translate-y-1/2 px-2 py-1 -rotate-6 bg-[#E3B505] text-xs border-2 border-[#2C191D] shadow-boxes-small shadow-[#2C191D]">EST. 2026</span>
        </div>
      </main>
    </div>
  );
}
