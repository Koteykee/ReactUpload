import { Layout } from "./Layout";

export const WelcomePage = () => {
  const { user } = useAuthStore();

  return (
    <Layout>
      {!user ? (
        <h1 className="text-[26px] m-5 font-bold text-center">
          Hello! Please login to upload a picture!
        </h1>
      ) : (
        <h1 className="text-[26px] m-5 font-bold text-center">
          You are logged in as {user.email}
        </h1>
      )}
    </Layout>
  );
};
//импорт
