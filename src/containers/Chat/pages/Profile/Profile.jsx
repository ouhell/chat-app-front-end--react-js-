import { Avatar, Button, Input, Skeleton, Spin } from "antd";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import c from "./Profile.module.scss";

const initialFromData = {
  feilds: {
    username: {
      value: "",
      istouched: false,
      validation: {},
      isValid: false,
      object_name: "username", // the name of the feild in the fetched data
    },
    "personal name": {
      value: "",
      istouched: false,
      validation: {},
      isValid: false,
      object_name: "personal_name", // the name of the feild in the fetched data
    },
    "E-mail": {
      value: "",
      istouched: false,
      validation: {},
      isValid: false,
      object_name: "email", // the name of the feild in the fetched data
    },
  },
  isFormValid: false,
};

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState("");
  const [formData, setFormData] = useState(initialFromData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isUpdatingPic, setIsUpdatingPic] = useState(false);
  const fileUploader = useRef();

  function fetchProfileData() {
    if (isLoading) return;
    setIsLoading(true);
    setIsError(false);
    axios
      .get("api/userapi/profile", {
        headers: {
          authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("userData")).access_token,
        },
      })
      .then((res) => {
        console.log("fetched profile :", res.data);
        setProfilePicture(res.data.profile_picture);

        setFormData((prevFormData) => {
          const newFormData = { ...prevFormData };
          const newFeilds = { ...newFormData.feilds };
          for (let key in newFeilds) {
            console.log("key ", newFeilds[key].object_name);
            const newFeild = {
              ...newFeilds[key],
              value: res.data[newFeilds[key].object_name],
            };
            newFeilds[key] = newFeild;
          }
          newFormData.feilds = newFeilds;
          return newFormData;
        });
      })
      .catch((err) => {
        console.log("fetch profile error :", err);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function updateData() {
    setIsUpdatingInfo(true);
    const updateData = {};
    for (let feild in formData.feilds) {
      console.log("update key ", feild);
      updateData[formData.feilds[feild].object_name] =
        formData.feilds[feild].value;
    }
    axios
      .put("api/userapi/profile", updateData, {
        headers: {
          authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("userData")).access_token,
        },
      })
      .then((res) => {
        console.log("update profile res :", res.data);
      })
      .catch((err) => {
        console.log("update profile err", err);
      })
      .finally(() => {
        setIsUpdatingInfo(false);
      });
  }

  function updatePic(image) {
    if (isUpdatingPic || !image) return;
    setIsUpdatingPic(true);
    const data = new FormData();
    data.append("profile_pic", image);
    axios
      .put("api/userapi/profile/picture", data, {
        headers: {
          authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("userData")).access_token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setProfilePicture(res.data.newUrl);
      })
      .catch((err) => {})
      .finally(() => {
        setIsUpdatingPic(false);
      });
  }

  useEffect(() => {
    fetchProfileData();
  }, []);

  function changeData(value, key) {
    setFormData((prevData) => {
      const newFormData = { ...prevData };
      const newFeilds = { ...newFormData.feilds };
      newFeilds[key] = { ...newFeilds[key], value, istouched: true };
      newFormData.feilds = newFeilds;
      return newFormData;
    });
  }

  const displayReady = !isLoading && !isError;
  return (
    <div className={c.Profile}>
      <header className={c.Header}>My Profile</header>

      <div className={c.ProfilPicHolder}>
        {isLoading ? (
          <Skeleton.Avatar className={c.ProfilPic} active size={90} />
        ) : null}
        {displayReady ? (
          <div
            style={{
              width: "fit-content",
              borderRadius: "100%",
              backgroundColor: "var(--main-blank)",
            }}
          >
            <input
              ref={fileUploader}
              type={"file"}
              style={{
                display: "none",
              }}
              onChange={(e) => {
                updatePic(e.target.files[0]);
              }}
            />
            <Spin
              spinning={isUpdatingPic}
              indicator={
                <LoadingOutlined
                  style={{
                    color: "var(--primary-soft)",
                  }}
                />
              }
            >
              <Avatar
                onClick={() => {
                  fileUploader.current.click();
                }}
                size={90}
                src={profilePicture}
                style={{
                  fontSize: "2rem",
                }}
                className={"util-pointer " + c.ProfilPic}
              >
                U
              </Avatar>
            </Spin>
          </div>
        ) : null}
      </div>
      <div className={c.ProfilInfoHolder}>
        {isLoading ? <Skeleton active /> : null}
        {displayReady
          ? Object.keys(formData.feilds).map((key) => {
              const isValid =
                !formData.feilds[key].istouched || formData.feilds[key].isValid;
              return (
                <div className={c.DataChanger} key={key}>
                  <label className={c.Label}>{key}</label>
                  <div className={c.InputHolder}>
                    <Input
                      placeholder={key}
                      value={formData.feilds[key].value}
                      meta-status={isValid ? "normal" : "error"}
                      status={isValid ? "normal" : "error"}
                      onChange={(e) => {
                        changeData(e.target.value, key);
                      }}
                    />
                  </div>
                </div>
              );
            })
          : null}
        {displayReady ? (
          <Button
            className={c.EditButton}
            loading={isUpdatingInfo}
            onClick={updateData}
          >
            Edit Profile
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
