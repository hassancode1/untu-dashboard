'use client';
import { useState } from 'react';

import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

export default function Uploader() {
  const [uppy] = useState(
    () =>
      new Uppy({
        restrictions: {
          maxNumberOfFiles: 5,
          allowedFileTypes: ['image/*'],
          maxFileSize: 5 * 1000 * 1000
        }
      })
  );

  // uppy.on("file-added", (file) => {
  // 	file.meta = {
  // 		...file.meta,
  // 		bucketName: "images",
  // 		contentType: file.type,
  // 	};
  // });

  // uppy.on("upload-success", () => {
  // 	uppy.cancelAll();
  // 	if (inputRef.current) {
  // 		inputRef.current.value = "";
  // 	}
  // 	document.getElementById("trigger-close")?.click();
  // 	router.refresh();
  // });

  // const handleUpload = () => {
  // 	if (uppy.getFiles().length !== 0) {
  // 		const randomUUID = crypto.randomUUID();

  // 		uppy.setFileMeta(uppy.getFiles()[0].id, {
  // 			objectName:
  // 				user?.id + "/" + randomUUID + "/" + uppy.getFiles()[0].name,
  // 		});

  // 		uppy.upload().then(async () => {
  // 			const description = inputRef.current.value;
  // 			if (description.trim()) {
  // 				const { error } = await supabase
  // 					.from("posts")
  // 					.update({ description: description })
  // 					.eq("id", randomUUID);
  // 				if (error) {
  // 					toast.error("Fail to update descriptions.");
  // 				}
  // 			}
  // 		});
  // 	} else {
  // 		toast.warning("Please adding an image");
  // 	}
  // };

  return (
    // <Dialog>
    // 	<DialogTrigger asChild>
    // 		<button id="upload-trigger"></button>
    // 	</DialogTrigger>
    // 	<DialogContent>
    // 		<DialogHeader>
    // 			<DialogTitle>Daily Upload</DialogTitle>
    // 			<DialogDescription>Select your photo.</DialogDescription>
    // 		</DialogHeader>
    <div className=" absolute mx-auto  flex space-y-5">
      <Dashboard uppy={uppy} className="w-auto" hideUploadButton />
      {/* <Input placeholder=" image description" ref={inputRef} />
					<Button className="w-full" onClick={handleUpload}>
						Upload
					</Button> */}
    </div>
    // 	</DialogContent>
    // </Dialog>
  );
}
