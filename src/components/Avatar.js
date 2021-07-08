function Avatar({ src, email }) {
  return src ? (
    <img className="h-full w-full rounded-full z-50" src={`${src}`} alt="" />
  ) : (
    <p className="grid place-items-center h-full w-full object-contain text-lg text-white uppercase bg-cyan-700  rounded-full z-50">
      {email?.slice(0, 1)}
    </p>
  );
}

export default Avatar;
