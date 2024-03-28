// import Dropzone, { FileWithPath } from "react-dropzone";
// // import { MdOutlineFileUpload } from "react-icons/md";
// // import { FaFilePdf } from "react-icons/fa";

// interface Props {
//   file: FileWithPath | null;
//   handleUpload: (x: FileWithPath[]) => void;
// }
// const UploadFile = ({ file, handleUpload }: Props) => {
//   return (
//     <div className="border border-slate-400  border-dashed rounded-md w-full py-8 px-8 flex flex-col justify-center items-center text-center">
//       <Dropzone onDrop={handleUpload} minSize={1024} maxSize={3072000}>
//         {({ getRootProps, getInputProps, isDragAccept, isDragReject }) => {
//           const additionalClass = isDragAccept
//             ? "accept"
//             : isDragReject
//             ? "reject"
//             : "";

//           return (
//             <div
//               {...getRootProps({
//                 className: dropzone ${additionalClass},
//               })}
//             >
//               <input {...getInputProps()} />
//               {/* <div className="flex justify-center items-center">
//                 {file && file.type === "application/pdf" ? (
//                   <FaFilePdf size={50} />
//                 ) : (
//                   <MdOutlineFileUpload />
//                 )}
//               </div> */}
//               {file ? (
//                 ""
//               ) : (
//                 <p className="text-slate-500 text-[14px]">
//                   Drag & Drop or{" "}
//                   <span className="text-blue-400"> Choose file</span> to upload
//                 </p>
//               )}
//             </div>
//           );
//         }}
//       {/* </Dropzone> */}
//       {file && file.name}
//     </div>
//   );
// };

// export default UploadFile;
