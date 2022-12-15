/** @jsxImportSource @emotion/react */
import "twin.macro";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "../../parts/button";
import { useContext, useState } from "react";
import { StyledForm } from "../../parts/form";
import PostCard from "../PostCard";
import CollectionContext from "../../context/collection";
import Input from "../Input";
import { addNewCollection } from "../../utils/handler";
import { toast } from "react-toastify";
import { haveSpecialChar } from "../../utils/helpers";
import { TextFormStatus } from "../../parts/text";
import { nanoid } from "nanoid";
import ModalContainer from "./Container";

const UpdateCollection = (props) => {
  const { open, setOpen, data, setOpenModalCollection, editedData, variant } =
    props;
  const collectionData = useContext(CollectionContext).collectionData;
  const setCollectionData = useContext(CollectionContext).setCollectionData;

  const [formValues, setFormValues] = useState({
    name: ""
  });
  const [validation, setValidation] = useState({
    name: ""
  });

  useEffect(() => {
    if (variant === "edit") {
      const { name: newName } = editedData;
      setFormValues({
        ...formValues,
        name: newName
      });
    }
  }, [editedData]);

  useEffect(() => {
    if (!open) {
      setFormValues({
        name: ""
      });
      setValidation({
        name: ""
      });
    }
  }, [open]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const checkValidName = (name) => {
    const isDuplicateName = collectionData.find(
      (collection) => collection.name === formValues.name
    );

    if (isDuplicateName) {
      return setValidation({
        name: "collection name already exist, please create a new one"
      });
    }

    if (haveSpecialChar(name)) {
      return setValidation({
        name: "collection name can't contain special character e.g: '@/#'"
      });
    }

    return true;
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const validName = checkValidName(formValues.name);

    if (validName) {
      if (variant === "edit") {
        const selectedCollectionIdx = collectionData.findIndex(
          (item) => item.name === editedData.name
        );

        collectionData[selectedCollectionIdx].name = formValues.name;
        setCollectionData([...collectionData]);
      } else {
        const postData = {
          ids: nanoid(16),
          ...data
        };

        const newData = {
          name: formValues.name,
          posts: Object.keys(data).length > 0 ? [postData] : []
        };

        const formatData = addNewCollection(newData);

        setCollectionData([...collectionData, { ...formatData }]);
      }

      setOpen(false);
      setFormValues({
        name: ""
      });
      setValidation({
        name: ""
      });

      if (setOpenModalCollection) {
        setOpenModalCollection(false);
      }

      toast.success(
        variant === "edit" ? "Hooray! It Updated" : "Hooray! It Saved",
        {
          position: toast.POSITION.TOP_CENTER
        }
      );
    }
  };

  return (
    <>
      <ModalContainer
        isOpen={open}
        contentLabel={
          variant === "edit" ? "Edit Collection" : "Add to Collection"
        }
      >
        <Button
          variant="danger"
          shape="circle"
          tw="absolute right-3 top-3"
          onClick={() => setOpen(false)}
        >
          X
        </Button>
        <h1>{variant === "edit" ? "Edit" : "Add to"} Collection</h1>
        <p>
          {variant === "edit"
            ? "Edit this collection name"
            : "Create new collection and save this anime to that collection"}
        </p>
        <div tw="flex flex-col w-full justify-center lg:flex-row">
          {data && Object.keys(data).length !== 0 && (
            <PostCard
              image={data?.coverImage?.large}
              title={data?.title?.romaji}
              score={data?.averageScore}
              episodes={data?.episodes}
            />
          )}

          <StyledForm tw="mt-5" onSubmit={handleOnSubmit}>
            <Input
              label="Name"
              aria-label="name"
              name="name"
              type="text"
              placeholder="Like 'Favorite Anime'"
              onChange={handleInputChange}
              value={formValues.name ? formValues.name : ""}
              status={validation.name !== "" && "danger"}
            />
            {validation.name !== "" && (
              <small>
                <TextFormStatus variant="danger">
                  {validation.name}
                </TextFormStatus>
              </small>
            )}
            <div tw="flex w-full justify-center">
              <Button>Save</Button>
            </div>
          </StyledForm>
        </div>
      </ModalContainer>
    </>
  );
};

UpdateCollection.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  data: PropTypes.object,
  setOpenModalCollection: PropTypes.func
};

UpdateCollection.defaultProps = {
  open: false,
  setOpen: null,
  data: {},
  editedData: {},
  setOpenModalCollection: null
};

export default UpdateCollection;
