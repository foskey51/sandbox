import useStore from "../../store";

const Assistant = () => {
  const darkMode = useStore(state => state.darkMode);
  return (
    <>
      <div className={`flex flex-col items-center  ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} h-screen `}>
        <div className={`flex justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}  w-[90%] p-5 mt-3 rounded-2xl border-1`}>
          <span className={`${darkMode ? 'text-white' : 'text-black'} truncate`}>{`Llama AI`}</span>
        </div>
        <textarea
          className={`${darkMode ?'bg-gray-900 text-white placeholder-gray-400' :'bg-white text-black placeholder-gray-500'} mb-3 focus:outline-none text-wrap mt-auto w-[90%] border-1 rounded-xl resize-none`}
          placeholder="Say something"
        />

      </div>
    </>
  )
}

export default Assistant;