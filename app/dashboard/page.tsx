const Dashboard = () => {
  return (
    <main className="bg-[#E9E3C8] font-bevan font-medium italic text-6xl w-auto h-[200em]">
      <section>
        <h1>Dashboard</h1>
        <form>
          <div className="flex">
            <button className="">vinyl</button>
            <button>cd</button>
          </div>
          <div>
            <h2>search discogs</h2>
            <div>
              <input name="searchAlbum" type='text' placeholder="kind of blue" />
              <button>search</button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Dashboard
