import {useDispatch, useSelector} from "react-redux";
import {set_theme} from "../../store/Slices/Themes/index.jsx";
import {useEffect} from "react";

export default function Themes (){

    const currentTheme = useSelector(state => state.themes.theme)
    const dispatch = useDispatch()

    const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
    "synthwave", "retro", "cyberpunk", "valentine", "halloween",
    "garden", "forest", "aqua", "lofi", "pastel", "fantasy",
    "wireframe", "black", "luxury", "dracula", "cmyk", "autumn",
    "business", "acid", "lemonade", "night", "coffee", "winter", "mycustomtheme"
    ];

    const handleChangeTheme = (theme) => {
        dispatch(set_theme(theme))
        localStorage.setItem('theme', theme);
    }

    useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes.includes(savedTheme)) {
      handleChangeTheme(savedTheme);
    }
    }, []);

    return(
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Theme Switcher</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {themes.map((theme) => (
          <button
            key={theme}
            className={`btn btn-sm ${currentTheme === theme ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleChangeTheme(theme)}
            data-set-theme={theme}
          >
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
              <div className="capitalize">{theme}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
    )
}