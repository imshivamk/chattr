const DecoratorBg = () => {
  return (
    <div className="decorators absolute z-0  inset-0 pointer-events-none overflow-hidden">
      <div className="absolute z-0 inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-position-[14px_24px]" />
      <div className="absolute z-0 top-0 -left-4 size-96 bg-cyan-400 opacity-20 blur-[100px]" />
      <div className="absolute z-0 bottom-0 -right-4 size-96 bg-violet-900 opacity-20 blur-[100px]" />
    </div>
  );
};

export default DecoratorBg;
