import styles from "./page.module.css";

interface UserProps {
  user: {
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
  };
  blockUser: (id: number) => void;
  suspendUser: (id: number) => void;
}

export function User({ user, blockUser, suspendUser }: UserProps) {
  // default values
  const {
    user_first_name = "N/A",
    user_last_name = "N/A",
    user_bio = "No bio available",
    user_avatar = "default-avatar.png",
    user_register_day = "Unknown",
    user_last_login = "Never",
    user_status = "Inactive",
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
      <p className={styles.userBio}>Bio: {user_bio}</p>
      <a onClick={() => blockUser(user.id)} className={styles.blockButton}>
        Block
      </a>
      <p className={styles.userComments}>Comments: placeholder text</p>
      <a onClick={() => suspendUser(user.id)} className={styles.suspendButton}>
        Suspend
      </a>
    </div>
  );
}
