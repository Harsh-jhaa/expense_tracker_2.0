import multer from 'multer';

const storage = multer.diskStorage(
    {
        destination: (req,file,cb) =>{
            cb(null, 'uploads/')
        },
        filename:(req,file,cb)=>{
            cb(null,`${Date.now()}-${file.originalname}`)
    },
    })

    const filter = (req,file,cb)=>{
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if(allowedTypes.includes(filename.mimetype)){
            cb(null,true)
        }
        else{
            cb(new Error("Invalid file type, only JPEG, JPG and PNG are allowed"),false)
        }
    }

    const upload = multer({ storage, filter });

    export default upload ;

