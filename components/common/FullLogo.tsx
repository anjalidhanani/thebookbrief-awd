import Image from "next/image";

const FullLogo = () => {
  return (
    <Image
      className="object-contain w-30"
      src={"/images/logo-full.png"}
      alt={"thebookbrief"}
      width={150}
      height={50}
    />
  );
};
export default FullLogo;
