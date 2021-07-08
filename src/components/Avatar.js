import Image from "next/image";

function Avatar({ src, email }) {
  console.log(src);
  return src ? (
    <Image
      src={`${src}`}
      height={110}
      width={110}
      className="cursor-pointer rounded-full"
    />
  ) : (
    <p className="grid place-items-center h-full w-full object-contain text-lg text-white uppercase bg-cyan-700  rounded-full z-50">
      {email?.slice(0, 1)}
    </p>
  );
}

export default Avatar;
