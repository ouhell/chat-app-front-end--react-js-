import { Avatar, Button, Input, Skeleton, Spin, notification } from "antd";
import axios from "axios";

import {
  UnlockOutlined,
  LockOutlined,
  UserOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import c from "./Profile.module.scss";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "../../../../store/slices/authenticationSlice";
import { AnimatePresence, motion } from "framer-motion";

const Profile = () => {
  const usernameCounter = useRef(0);
  const userData = useSelector((state) => state.auth.userData);
  const emailCounter = useRef(0);
  const currentProfile = useRef({});
  const dispatch = useDispatch();
  const [notifApi, notifContextHolder] = notification.useNotification();
  const [updateFormData, setUpdateFormData] = useState({
    feilds: {
      init: function () {
        for (let i in this) {
          if (typeof this[i] == "object") {
            this[i].parent = this;
          }
        }
        delete this.init;
        return this;
      },
      username: {
        label_name: "Username",
        value: "",
        validation: (value) => {
          const testingValue = value.trim();
          const validation = {
            isValid: true,
            errorMessage: "",
          };

          if (currentProfile.current.username.trim() === testingValue)
            return setValidation("username", validation);

          if (testingValue.length < 4) {
            validation.isValid = false;
            validation.errorMessage =
              "username must be longer than 3 characters";
            return setValidation("username", validation);
          }

          // check if username already exists
          setloading("username", true);
          usernameCounter.current++;
          const counter = usernameCounter.current;

          axios
            .get("/api/auth/usernameExist/" + testingValue)
            .then((res) => {
              if (res.data && testingValue !== userData.username) {
                validation.isValid = false;
                validation.errorMessage = "username already exists!";
              }
            })
            .catch((err) => {
              validation.isValid = false;
              validation.errorMessage = "connection error";
            })
            .finally(() => {
              if (usernameCounter.current !== counter) return;

              setValidation("username", validation);
            });
        },
        isValid: false,
        errorMessage: "",
        isTouched: false,
        isLoading: false,
        input_config: {
          type: "text",
          prefix: <UserOutlined className={c.PrefixIcon} />,
          placeHolder: "Username",
          maxLength: 25,
        },
      },
      personal_name: {
        label_name: "Personal Name",
        value: "",
        validation: (value) => {
          const testingValue = value.trim();
          const validation = {
            isValid: true,
            errorMessage: "",
          };

          if (testingValue.length < 4) {
            validation.isValid = false;
            validation.errorMessage = "name must be longer than 3 characters";
            return setValidation("personal_name", validation);
          }

          setValidation("personal_name", validation);
        },
        isValid: false,
        errorMessage: "",
        isTouched: false,
        isLoading: false,
        input_config: {
          type: "text",
          prefix: <UserOutlined className={c.PrefixIcon} />,
          placeHolder: "Personal Name",
          maxLength: 25,
        },
      },
      email: {
        label_name: "E-mail",
        value: "",
        validation: (value) => {
          const testingValue = value.trim();
          const validation = {
            isValid: true,
            errorMessage: "",
          };

          if (currentProfile.current.email.trim() === testingValue)
            return setValidation("email", validation);

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testingValue)) {
            validation.isValid = false;
            validation.errorMessage = "invalid email";
            return setValidation("email", validation);
          }

          setloading("email", true);
          emailCounter.current++;
          const counter = emailCounter.current;

          axios
            .get("/api/auth/emailExist/" + testingValue)
            .then((res) => {
              if (res.data) {
                validation.isValid = false;
                validation.errorMessage = "email already exists!";
              }
            })
            .catch((err) => {
              validation.isValid = false;
              validation.errorMessage = "connection error";
            })
            .finally(() => {
              console.log("email exists check");
              if (emailCounter.current !== counter) return;
              setValidation("email", validation);
            });
        },
        isValid: false,
        errorMessage: "",
        isTouched: false,
        isLoading: false,
        input_config: {
          type: "text",
          prefix: <span className={c.PrefixIcon}>@</span>,
          placeHolder: "Email",
          maxLength: 60,
        },
      },
    }.init(),
  });

  const [profilePicture, setProfilePicture] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isUpdatingPic, setIsUpdatingPic] = useState(false);
  const fileUploader = useRef();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const isFormValid = function () {
    for (let feild in updateFormData.feilds) {
      if (!updateFormData.feilds[feild].isValid) {
        return false;
      }
    }

    return true;
  };

  function validateAll() {
    for (let feild in updateFormData.feilds) {
      if (!updateFormData.feilds[feild].isValid) {
        updateFormData.feilds[feild].validation(
          updateFormData.feilds[feild].value
        );
      }
    }
  }

  const resetFeildsParent = useCallback(function (feilds) {
    (feilds.init = function () {
      for (let i in this) {
        if (typeof this[i] == "object") {
          this[i].parent = this;
        }
      }
      delete this.init;
    }),
      feilds.init();
  }, []);

  const setloading = useCallback(function (key, value) {
    setUpdateFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      const newFeilds = { ...newFormData.feilds };
      const selectedFeild = { ...newFeilds[key] };

      selectedFeild.isTouched = true;
      selectedFeild.isValid = false;
      selectedFeild.isLoading = value;

      newFeilds[key] = selectedFeild;

      resetFeildsParent(newFeilds);

      newFormData.feilds = newFeilds;
      return newFormData;
    });
  }, []);

  const setValidation = useCallback(function (key, validation) {
    setUpdateFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      const newFeilds = { ...newFormData.feilds };
      const selectedFeild = { ...newFeilds[key] };

      selectedFeild.isTouched = true;
      selectedFeild.isValid = validation.isValid;
      selectedFeild.errorMessage = validation.errorMessage;
      selectedFeild.isLoading = false;
      newFeilds[key] = selectedFeild;
      resetFeildsParent(newFeilds);
      newFormData.feilds = newFeilds;
      return newFormData;
    });
  }, []);

  const fetchProfileData = useCallback(
    function () {
      if (isLoading) return;
      setIsLoading(true);
      setIsError(false);
      axios
        .get("api/userapi/profile", {
          headers: {
            authorization: "Bearer " + userData.access_token,
          },
        })
        .then((res) => {
          setProfilePicture(res.data.profile_picture);

          setUpdateFormData((prevFormData) => {
            const newFormData = { ...prevFormData };
            const newFeilds = { ...newFormData.feilds };

            for (let key in newFeilds) {
              if (!res.data[key]) continue;
              const selectedFeild = { ...newFeilds[key] };
              selectedFeild.isTouched = false;
              selectedFeild.isValid = false;
              selectedFeild.isLoading = false;
              selectedFeild.value = res.data[key];
              newFeilds[key] = selectedFeild;
            }

            resetFeildsParent(newFeilds);
            newFormData.feilds = newFeilds;
            return newFormData;
          });

          currentProfile.current = res.data;
        })
        .catch((err) => {
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [isLoading, isError]
  );

  const changeValue = useCallback(function (key, newValue) {
    setUpdateFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      const newFeilds = { ...newFormData.feilds };
      const selectedFeild = { ...newFeilds[key] };

      selectedFeild.isTouched = true;
      selectedFeild.value = newValue;

      newFeilds[key] = selectedFeild;
      resetFeildsParent(newFeilds);
      newFormData.feilds = newFeilds;
      return newFormData;
    });

    updateFormData.feilds[key].validation(newValue);
  }, []);

  function updateData() {
    if (isUpdatingInfo) return;

    if (!isFormValid()) {
      return validateAll();
    }
    setIsUpdatingInfo(true);
    const updateData = {};
    for (let feild in updateFormData.feilds) {
      updateData[feild] = updateFormData.feilds[feild].value;
    }
    axios
      .put("api/userapi/profile", updateData, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        currentProfile.current = updateData;
        notifApi.success({
          message: "Profile info updated!",
          duration: 2,
        });
        dispatch(AuthActions.setUsername(updateData.username));
      })
      .catch((err) => {
        console.log("update profile err", err);
      })
      .finally(() => {
        setIsUpdatingInfo(false);
      });
  }

  const updatePic = useCallback(
    function (image) {
      if (isUpdatingPic || !image) return;
      setIsUpdatingPic(true);
      const data = new FormData();
      data.append("profile_pic", image);
      axios
        .put("api/userapi/profile/picture", data, {
          headers: {
            authorization: "Bearer " + userData.access_token,
          },
        })
        .then((res) => {
          setProfilePicture(res.data.newUrl);
          dispatch(AuthActions.setProfilePicture(res.data.newUrl));
        })
        .catch((err) => {})
        .finally(() => {
          setIsUpdatingPic(false);
        });
    },
    [isUpdatingPic]
  );

  const displayReady = !isLoading && !isError;
  return (
    <AnimatePresence>
      <motion.div
        className={c.Profile}
        initial={{
          y: 50,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: -50,
          opacity: 0,
        }}
      >
        {notifContextHolder}
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
                backgroundColor: "var(--primary-blank)",
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
                  className={"util-pointer util-capitalized " + c.ProfilPic}
                >
                  {userData.username[0]}
                </Avatar>
              </Spin>
            </div>
          ) : null}
        </div>
        <div className={c.ProfilInfoHolder}>
          {isLoading ? <Skeleton active /> : null}
          {displayReady
            ? Object.keys(updateFormData.feilds).map((key) => {
                const feild = updateFormData.feilds[key];
                const config = feild.input_config;

                const props = {
                  onChange: (e) => {
                    changeValue(key, e.target.value, key);
                  },
                  value: feild.value,
                  maxLength: config.maxLength,
                  placeholder: config.placeHolder,
                  className: c.Input,
                  status:
                    !feild.isValid && feild.isTouched && !feild.isLoading
                      ? "error"
                      : "normal",
                  prefix: config.prefix,
                  suffix: feild.isValid ? (
                    <CheckOutlined
                      style={{
                        color: "green",
                      }}
                    />
                  ) : feild.isLoading ? (
                    <LoadingOutlined
                      style={{
                        color: "var(--primary-soft)",
                      }}
                    />
                  ) : null,
                };

                let InputType = Input;

                if (config.type === "input.password") {
                  InputType = Input.Password;
                  props.visibilityToggle = config.visibilityToggle;
                }
                return (
                  <div className={c.DataChanger} key={key}>
                    <label className={c.Label}>{feild.label_name}</label>
                    <div className={c.InputHolder}>
                      {feild.errorMessage ? (
                        <div className={c.InputError}>{feild.errorMessage}</div>
                      ) : null}
                      <InputType {...props} />
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
      </motion.div>
    </AnimatePresence>
  );
};

export default Profile;
