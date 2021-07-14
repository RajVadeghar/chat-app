import { BadgeCheckIcon } from "@heroicons/react/solid";
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
        <BadgeCheckIcon className="absolute h-6 text-blue-600  -top-2 -left-2 z-50 " />
      )}
    </div>
  ) : (
    <p className="whitespace-nowrap relative grid place-items-center h-11 w-11 object-contain text-lg text-white uppercase bg-cyan-700  rounded-full z-50">
      {email?.slice(0, 1)}
      {isAdmin && (
        <BadgeCheckIcon className="absolute text-blue-600 h-6 -top-2 -left-2 z-50 " />
      )}
    </p>
  );
}

export default Avatar;
