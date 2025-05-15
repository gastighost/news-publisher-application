import styles from "./page.module.css";
import EditorButton from "./button";

interface UserInfoPageProps {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    bio?: string;
    avatar?: string;
    type: string;
    registrationDate?: string;
    lastLoginDate?: string;
    userStatus: string;
  };
}

export default function UserInfoPage({ user }: UserInfoPageProps) {
  // default values
  const {
    bio = "Amazing writer and news publisher.",
    avatar = "/default-avatar.png",
    registrationDate = "Unknown",
  } = user;

  return (
    <>
      <div className={styles.layer2}>
        <div className={styles.upper}>
          <img className={styles.avatar} src={avatar} alt="User Profile"></img>
          <div className={styles.nameFlex}>
            <h2
              className={styles.name}
            >{`${user.firstName} ${user.lastName}`}</h2>
            <h3 className={styles.name} style={{ color: "#b9b9b9" }}>
              {user.type}
            </h3>
          </div>
          <div className={styles.contact}>
            <EditorButton
              bgColor="#002f6c"
              clickEvent={() => alert(`Sending email to ${user.email}`)}
            >
              Contact
            </EditorButton>
          </div>
        </div>
        <br></br>
        <div className={styles.divider}></div>
        <h3>About</h3>
        <p>{bio}</p>
        <div className={styles.memberFlex}>
          <h4>Member Since</h4>
          <p>{user.registrationDate}</p>
        </div>
      </div>
    </>
  );
}
