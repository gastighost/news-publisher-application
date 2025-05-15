import styles from "./page.module.css";

export interface UserType {
  id: number;
  username: string;
  user_email: string;
  user_first_name?: string;
  user_last_name?: string;
  user_bio?: string;
  user_avatar?: string;
  user_register_day?: string;
  user_last_login?: string;
  user_status?: string;
}

interface UserProps {
  user: UserType;
  blockUser: (id: number) => void;
  suspendUser: (id: number) => void;
}

export function User({ user, blockUser, suspendUser }: UserProps) {
  // default values
  const {
    user_first_name = "N/A",
    user_last_name = "N/A",
    user_bio = "No bio available, but how do we handle bios that are too long? abandned this is lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus, congue vel laoreet ac, dictum vitae odio. Maecenas nec enim et est facilisis euismod.".substring(
      0,
      120 // replace with user_bio when there is real data
    ) + "...",
    user_avatar = "default-avatar.png",
    user_register_day = "Unknown",
    user_last_login = "Never",
    user_status = "Active",
  } = user;

  return (
    <div className={styles.userCard}>
      <img
        src={user_avatar}
        alt={`${user_first_name} ${user_last_name}`}
        width="50%"
        className={styles.userAvatar}
      />
      <h2 className={styles.userName}>{user.username}</h2>
      <h3>{user_status}</h3>
      <p className={styles.userBio}>Bio: {user_bio}</p>
      <p className={styles.userComments}>Comments: placeholder text</p>
      <div className={styles.btns}>
        <a
          onClick={() => blockUser(user.id)}
          style={{ backgroundColor: "red" }}
          className={styles.blockButton}
        >
          Block
        </a>
        <a
          onClick={() => suspendUser(user.id)}
          style={{ backgroundColor: "darkorange" }}
          className={styles.suspendButton}
        >
          Suspend
        </a>
      </div>
    </div>
  );
}
