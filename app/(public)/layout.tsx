export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-full w-full flex bg-white bg-cover orange">
        <div className="z-10 w-screen min-h-screen overflow-x-hidden">
          {children}
        </div>
      </div>
    </>
  );
}
