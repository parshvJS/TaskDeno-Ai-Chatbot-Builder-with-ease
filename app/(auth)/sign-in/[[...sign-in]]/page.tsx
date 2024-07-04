import { SignIn} from "@clerk/nextjs";

export default function Page() {
    //   return <sign-in />;
    return (
        <div className="flex flex-col  items-center justify-center w-screen h-screen">
            <SignIn
                forceRedirectUrl={'/mydenos'}
            />


        </div>
    )
}