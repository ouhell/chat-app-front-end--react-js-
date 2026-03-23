import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Input, Modal, Button } from "antd";

import { useEffect, useState } from "react";
import {
  addContactRequest,
  deleteContactRequest,
  getContactCandidates,
} from "../../../../../../../../client/ApiClient";
import { ChatActions } from "../../../../../../../../store/slices/ChatSlice";
import Candidate from "./components/Candidate/Candidate";
import c from "./ContactAdder.module.scss";
import { useAppDispatch } from "../../../../../../../../store/ReduxHooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../../../client/queryKeys";
type ContactAdderProps = {
  open: boolean;
  onCancel: (...args: any[]) => any;
};
const ContactAdder = ({ open, onCancel }: ContactAdderProps) => {
  const [searchtext, setSearchtext] = useState("");
  const [candidateState, setCandidateState] = useState<{
    [key: string]: {
      sendLoading?: boolean;
      isCancelLoading?: boolean;
      sent?: boolean;
      request?: string | null;
    };
  }>({});

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const candidateQuery = useQuery({
    queryKey: queryKeys.contactCandidates(searchtext),
    queryFn: async () => {
      const res = await getContactCandidates(searchtext);
      return res.data as User[];
    },
    enabled: false,
  });
  const sendRequestMutation = useMutation({
    mutationFn: (id: string) => addContactRequest(id),
  });

  const cancelRequestMutation = useMutation({
    mutationFn: (requestId: string) => deleteContactRequest(requestId),
  });
  const data = candidateQuery.data ?? [];

  const [candidateHolder] = useAutoAnimate();

  useEffect(() => {
    if (open) fetchCandidates();
  }, [open]);

  const fetchCandidates = () => {
    candidateQuery.refetch();
  };

  const sendRequest = (id: string) => {
    setCandidateState((prevState) => {
      const newState = { ...prevState };
      newState[id] = {
        sendLoading: true,
      };
      return newState;
    });

    sendRequestMutation
      .mutateAsync(id)
      .then((res) => {
        setCandidateState((prevState) => {
          const newState = { ...prevState };
          newState[id] = {
            sendLoading: false,
            sent: true,
            request: res.data._id,
          };
          return newState;
        });
        queryClient.setQueryData<Request[]>(queryKeys.requests, (oldData) => {
          if (!oldData) return [res.data];
          return [...oldData, res.data];
        });
        dispatch(
          ChatActions.emit({
            event: "send request",
            data: res.data,
          }),
        );
      })
      .catch((err) => {
        console.log("add request error :", err);
        setCandidateState((prevState) => {
          const newState = { ...prevState };
          newState[id] = {
            sendLoading: false,
          };
          return newState;
        });
      });
  };
  const cancelRequest = (id: string) => {
    if (!candidateState[id]) return;
    if (!candidateState[id].request) return;

    setCandidateState((prevState) => {
      if (prevState[id]) {
        if (prevState[id].isCancelLoading) return prevState;
      }
      const newState = { ...prevState };
      newState[id] = {
        ...newState[id],
        isCancelLoading: true,
      };
      return newState;
    });

    cancelRequestMutation
      .mutateAsync(candidateState[id].request ?? "")
      .then((res) => {
        queryClient.setQueryData<Request[]>(queryKeys.requests, (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((req) => req._id !== candidateState[id].request);
        });

        dispatch(
          ChatActions.emit({
            event: "cancel request",
            data: res.data,
          }),
        );
        setCandidateState((prevState) => {
          const newState = { ...prevState };
          newState[id] = {
            request: null,
            sent: false,
            isCancelLoading: false,
          };
          return newState;
        });
      })
      .catch((err) => {
        console.log("cancel request error", err);
        if (err.response?.data?.servedError && err.response.data.code === 404) {
          setCandidateState((prevState) => {
            const newState = { ...prevState };
            newState[id] = {
              request: null,
              sent: false,
              isCancelLoading: false,
            };
            return newState;
          });
          return;
        }
        setCandidateState((prevState) => {
          const newState = { ...prevState };
          newState[id] = {
            ...newState[id],
            isCancelLoading: false,
          };
          return newState;
        });
      });
  };
  return (
    <Modal
      className={c.ContactAdder}
      open={open}
      onCancel={onCancel}
      closable={false}
      footer={[
        <Button key="back" onClick={onCancel} className={c.CancelButton}>
          Return
        </Button>,
      ]}
      afterClose={() => {
        setCandidateState({});
        setSearchtext("");
      }}
    >
      <div
        className={c.Content}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className={c.Title}>Add Contact</div>
        <Input.Search
          placeholder="search username / personal name"
          className={c.SearchBar}
          loading={candidateQuery.isFetching}
          value={searchtext}
          onChange={(e) => {
            if (e.target.value.length > 40) return;
            setSearchtext(e.target.value);
          }}
          onSearch={fetchCandidates}
        />
        <div className={c.Candidates} ref={candidateHolder}>
          {data.map((candInfo) => {
            return (
              <Candidate
                cancelRequest={cancelRequest}
                sendRequest={sendRequest}
                candInfo={candInfo}
                candidateState={candidateState}
                key={candInfo._id}
              />
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ContactAdder;
