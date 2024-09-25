import { Component } from "solid-js";
import styles from "./AddPostInput.module.css";

const AddPostInput: Component<{
  text: string;
  setText: (value: string) => void;
}> = (props) => {
  return (
    <>
      <div class={`${styles.form__group} ${styles.field}`}>
        <input
          type="input"
          class={styles.form__field}
          placeholder=""
          name="name"
          id="name"
          required
          value={props.text}
          onChange={(e) => props.setText(e.target.value)}
        />
        <label for="name" class={styles.form__label}>
          
        </label>
      </div>
    </>
  );
};

export default AddPostInput;
