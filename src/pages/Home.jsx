import Assistant from "../components/Assistant";
import Editor from "../components/Editor";

const Home = () => {
    return (
        <>
            <div className="flex flex-row w-full">
                <div className="w-[20%]">
                    <Assistant />
                </div>
                <div className="w-[80%]">
                    <Editor />
                </div>
            </div>
        </>
    );
};

export default Home;
