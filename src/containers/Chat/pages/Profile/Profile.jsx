import { Avatar, Button, Input, Skeleton, Spin } from "antd";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import c from "./Profile.module.scss";

const initialFromData = {
  feilds: {
    username: { value: "", istouched: false, validation: {}, isValid: false },
    "personal name": {
      value: "",
      istouched: false,
      validation: {},
      isValid: false,
    },
    "E-mail": { value: "", istouched: false, validation: {}, isValid: false },
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
        setFormData({
          ...formData,
          feilds: {
            username: { ...formData.feilds.username, value: res.data.username },
            "personal name": {
              ...formData.feilds["personal name"],
              value: res.data.personal_name,
            },
            "E-mail": { ...formData.feilds["E-mail"], value: res.data.email },
          },
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
          <Avatar
            size={90}
            src={profilePicture}
            style={{
              fontSize: "2rem",
            }}
            className={"util-pointer " + c.ProfilPic}
          >
            U
          </Avatar>
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
          <Button className={c.EditButton} loading={isUpdatingInfo}>
            Edit Profile
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
