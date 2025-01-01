import AdminWrapper from "@/components/AdminWrapper";
import localFont from "next/font/local";
// import buttonStyles from "@/styles/buttons.module.css";
import { Button } from "@/components/ui/button";
import Router from "next/router";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import PP from "@/assets/icons/pp.webp";
// import { storage } from "@/lib/firebase";

const font = localFont({
  src: "../../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

// function delay(t, v) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve.bind(null, v), t);
//   });
// }

// function keepTrying(triesRemaining, storageRef) {
//   if (triesRemaining < 0) {
//     return Promise.reject("out of tries");
//   }

//   return storageRef
//     .getDownloadURL()
//     .then((url) => {
//       return url;
//     })
//     .catch((error) => {
//       switch (error.code) {
//         case "storage/object-not-found":
//           return delay(2000).then(() => {
//             return keepTrying(triesRemaining - 1, storageRef);
//           });
//         default:
//           console.log(error);
//           return Promise.reject(error);
//       }
//     });
// }

export default function AdminProfile() {
  const { data: session } = useSession();
  const [session1, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  

  useEffect(() => {
    getSession().then(async (session) => {
      setSession((prev) => session);
      if (session) {
        // console.log(session);
        setRole((prev) => session.user.name);
        await fetch("/api/getLoggedInUserDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session.user.email }),
        })
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
            console.log(user);
          });
      }
    });
  }, []);

  const [prop, setProp] = useState(null);
  function handleChange(e) {
    e.preventDefault();
    setProp(e.target.files[0]);
  }

  async function handleUpload(e) {
    e.preventDefault();
    // const userImage = prop; // Get the image file from the form
    // // const storageRef = storage.ref(); // Get a reference to the Firebase storage root

    // // const imageRef = storageRef.child(userImage.name); // Create a reference to the image file in Firebase storage
    // // const uploadTask = imageRef.put(userImage); // Upload the image file to Firebase storage

    // let curl = null;
    // try {
    //   await new Promise((resolve, reject) => {
    //     uploadTask.on(
    //       "state_changed",
    //       (snapshot) => {
    //         // Track the upload progress if needed
    //       },
    //       (error) => {
    //         console.error("Error uploading image:", error);
    //         reject(error);
    //       },
    //       () => {
    //         // When the upload is complete, get the download URL
    //         keepTrying(10, imageRef)
    //           .then((url) => {
    //             curl = url;
    //             console.log("Download URL:", url);

    //             console.log(user);
    //             resolve();
    //           })
    //           .catch((error) => {
    //             console.error("Error getting download URL:", error);
    //             reject(error);
    //           });
    //       }
    //     );
    //   });
    // } catch (error) {
    //   console.error("Error uploading image:", error);
    // }

    setUser((prevUser) => ({
      id: prevUser.id,
      name: prevUser.name,
      email: prevUser.email,
    }));
    // console.log("ok", curl);

    fetch("/api/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("User updated successfully:", data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  }

  // Function to handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // const imageUrl = await uploadImageToFirebase(file);
      const imageUrl = "";
      if (imageUrl) {
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: imageUrl,
        }));

        // Update the database with the new user object
        await fetch("/api/updateUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("User updated successfully:", data);
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          });
      }
    }
  };
  return (
    <AdminWrapper>
      <div>
        <div>
          <div className="flex flex-row mb-8">
            <div
              className="flex flex-row cursor-pointer hover:text-gray-1000 "
              onClick={() => Router.back()}
            >
              <svg
                class="w-6 h-6 text-gray-500 cursor-pointer  mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 8 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
                />
              </svg>
              <div>Go back</div>
            </div>
            <div
              className={`${fontBold.className} text-xl flex-[1] text-center`}
            >
              Admin Profile
            </div>
          </div>
          <div className={`flex md:flex-row flex-col-reverse justify`}>
            <div className="flex-[1] md:mt-0 mt-3">
              <div className="text-xl">
                <span className={fontBold.className}>Name: </span>{" "}
                {user && user.name}
              </div>
              <div>
                <span className={fontBold.className}>Admin ID: </span>
                {user && user.id}
              </div>
              <div>
                <span className={fontBold.className}>Email: </span>
                {user && user.email}
              </div>
              <div>
                <span className={fontBold.className}>Role: </span>
                {user && user.role}
              </div>
              <br />
            </div>
            <div>
              <Image
                src={user && user?.profile_pic ? user?.profile_pic : PP}
                width={300}
                height={300}
                alt="Profile Picture"
                className="h-100 w-100"
                style={{ objectFit: "cover", borderRadius: "15px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}

AdminProfile.auth = {
  required: true,
  // role: "admin",
  loading: <div>Loading...</div>,
  redirect: "/sys-admin/login",
};
