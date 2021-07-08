import { BadgeCheckIcon } from "@heroicons/react/outline";
import Image from "next/image";

function Avatar({ src, email }) {
  const isAdmin =
    email === "instigator0002@gmail.com" || email === "vadegharraj@gmail.com";
  return src ? (
    <div className="relative">
      <Image
        src={`${src}`}
        height={110}
        width={110}
        className="cursor-pointer rounded-full"
      />
      {isAdmin && (
        <BadgeCheckIcon className="absolute h-5 bg-blue-700 rounded-full -top-2 -left-2 z-50 text-white" />
      )}
    </div>
  ) : (
    <p className="relative grid place-items-center h-full w-full object-contain text-lg text-white uppercase bg-cyan-700  rounded-full z-50">
      {email?.slice(0, 1)}
      {isAdmin && (
        <BadgeCheckIcon className="absolute bg-blue-700 rounded-full h-5 -top-2 -left-2 z-50 text-white" />
      )}
    </p>
  );
}

export default Avatar;
