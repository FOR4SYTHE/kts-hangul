import re

with open('/home/bnkxx/vibe-sandbox/kts-hangul/src/App.tsx', 'r') as f:
    content = f.read()

# 1. Remove HaiChar
content = re.sub(r'const HaiChar = \(\) => \([\s\S]*?\n\);\n*', '', content)

# 2. Remove CartoonCamera
content = re.sub(r'const CartoonCamera = \(\) => \([\s\S]*?\n\);\n*', '', content)

# 3. Remove Sejong and toHangul
content = re.sub(r'const SejongSun = \(\) => \([\s\S]*?\n\);\n*', '', content)
content = re.sub(r'const SejongPetroglyph1 = \(\) => \([\s\S]*?\n\);\n*', '', content)
content = re.sub(r'const SejongPetroglyph2 = \(\) => \([\s\S]*?\n\);\n*', '', content)
content = re.sub(r'const toHangul = \(.*?\) => \{[\s\S]*?return result;\n\};\n*', '', content)

# 4. Remove Hangul Mode States
state_to_remove = r"""  const \[appMode, setAppMode\] = useState<'translator' \| 'hangul'>\('translator'\);\n  const \[isTransitioning, setIsTransitioning\] = useState\(false\);\n  const \[nextMode, setNextMode\] = useState<'translator' \| 'hangul'>\('translator'\);\n\n"""
content = re.sub(state_to_remove, '', content)

hangul_states = r"""  const \[hangulMode, setHangulMode\].*\n  const \[decodeTarget, setDecodeTarget\].*\n  const \[decodedCache, setDecodedCache\].*\n  const \[isDecoding, setIsDecoding\].*\n\n  const \[hangulInput, setHangulInput\].*\n  const \[hangulOutput, setHangulOutput\].*\n  const \[isHangulCopied, setIsHangulCopied\].*\n\n  const \[isArtMode, setIsArtMode\].*\n  const \[isGeneratingArt, setIsGeneratingArt\].*\n  const \[artBgIndex, setArtBgIndex\].*\n\n  const \[hangulHistory, setHangulHistory\].*\n  const \[showHangulHistory, setShowHangulHistory\].*\n\n"""
content = re.sub(hangul_states, '', content)

# 5. Remove Handlers
handle_mode_switch = r"""  const handleModeSwitch = \([\s\S]*?\}, 800\);\n  \};\n\n"""
content = re.sub(handle_mode_switch, '', content)

hangul_handlers = r"""  const handleGenerateHangul = \(\) => \{[\s\S]*?  const handleCopyHangul = async \(\) => \{[\s\S]*?    \}\n  \};\n\n"""
content = re.sub(hangul_handlers, '', content)

# 6. Remove Transition screen & fix main block
transition_screen = r"""      <AnimatePresence>\n        \{isTransitioning && \([\s\S]*?      </AnimatePresence>\n\n"""
content = re.sub(transition_screen, '', content)

main_opening = r"""      <main
        className={`min-h-[100dvh] font-sans p-6 pb-[calc(4.5rem+env(safe-area-inset-bottom))] flex flex-col items-center justify-start overflow-x-hidden relative ${appMode === 'translator' ? 'text-[#1A1A1A] selection:bg-[#93C5FD]' : 'text-[#2C2825] selection:bg-[#D4C3A3]'}`}
      >"""
main_replacement = r"""      <main
        className="min-h-[100dvh] font-sans p-6 pb-[calc(4.5rem+env(safe-area-inset-bottom))] flex flex-col items-center justify-start overflow-x-hidden relative text-[#1A1A1A] selection:bg-[#93C5FD]"
      >"""
content = content.replace(main_opening, main_replacement)

# Remove motion.div background logic
motion_div_old = r"""        <motion.div\n          className="fixed inset-0 -z-20 pointer-events-none"\n          animate=\{isGeneratingArt \? \{[\s\S]*?          \}\n        />\n\n"""
motion_div_new = r"""        <div
          className="fixed inset-0 -z-20 pointer-events-none"
          style={{ backgroundColor: '#796CE3', backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 3px, transparent 3px)', backgroundSize: '30px 30px' }}
        />

"""
content = re.sub(motion_div_old, motion_div_new, content)

# Remove mist painting
mist_painting = r"""        \{\/\* Traditional Korean Mist Painting Overlay \(Only in Hangul Mode\) \*\/\}\n        <AnimatePresence>\n          \{appMode === 'hangul' && \([\s\S]*?        </AnimatePresence>\n\n"""
content = re.sub(mist_painting, '', content)

# 7. Simplify Top controllers
controllers_old = r"""        <div className="w-full max-w-4xl flex justify-between items-center z-40 mb-2 relative">\n          <button\n            onClick=\{.*?\}\n            className=\{.*\}\n            title=\{.*?\}\n          >\n            \{appMode === 'translator' \? \(\n              <svg width="26" height="26" viewBox="0 0 100 100"[\s\S]*?              </svg>\n            \)\}\n          </button>\n\n          \{appMode === 'translator' \? \(\n            <button\n              onClick=\{.*?\}\n              className="w-12 h-12 bg-white border-4 border-black rounded-3xl doodle-shadow flex items-center justify-center transition-all duration-150 active:translate-x-\[4px\] active:translate-y-\[4px\] active:shadow-none hover:bg-gray-50"\n              title="History"\n            >\n              <History className="w-5 h-5 stroke-\[4\] text-\[#1A1A1A\]" />\n            </button>\n          \) : \(\n            <button[\s\S]*?            </button>\n          \)\}\n        </div>"""

controllers_new = r"""        <div className="w-full max-w-4xl flex justify-between items-center z-40 mb-2 relative">
          <button
            onClick={() => setIsLensOpen(true)}
            className="flex items-center justify-center w-12 h-12 transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none rounded-3xl doodle-shadow border-4 border-black text-white bg-[#CD2E3A] hover:bg-[#B0212E]"
            title="Supreme Lens"
          >
            <svg width="26" height="26" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="50" cy="50" r="10" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <g key={angle} style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }}>
                  <path d="M 46 41 C 30 15 40 2 50 2 C 60 2 70 15 54 41" />
                  <path d="M 47.5 39 C 42 22 46 12 50 12 C 54 12 58 22 52.5 39" />
                </g>
              ))}
            </svg>
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="w-12 h-12 bg-white border-4 border-black rounded-3xl doodle-shadow flex items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-gray-50"
            title="History"
          >
            <History className="w-5 h-5 stroke-[4] text-[#1A1A1A]" />
          </button>
        </div>"""
content = re.sub(controllers_old, controllers_new, content)

# 8. Simplify History Modals
history_modal_translator_old = r"""        {showHistory && appMode === 'translator' && ("""
history_modal_translator_new = r"""        {showHistory && ("""
content = content.replace(history_modal_translator_old, history_modal_translator_new)

hangul_history_modal = r"""        \{showHangulHistory && appMode === 'hangul' && \([\s\S]*?        \}\)\}\n\n"""
content = re.sub(hangul_history_modal, '', content)

# 9. Title Lockup
appmode_translator_block = r"""        {appMode === 'translator' && (
          <div className="w-full max-w-md z-10 flex flex-col items-center pt-4 pb-12 animate-in fade-in duration-500">
            <div className="w-full flex flex-col items-center justify-center relative mb-12 mt-6 select-none">
              <div className="relative inline-block transform -rotate-3 text-center">
                <h1
                  className="text-[3.2rem] sm:text-[4.5rem] md:text-[6rem] font-title leading-[1.1] tracking-normal sm:tracking-wide relative z-10 smooth-title-outline"
                >
                  <span className="text-[#0047A0] relative inline-block">
                    KOREAN
                    <div className="absolute -top-8 -left-15 sm:-top-12 sm:-left-18 z-20 pointer-events-none">
                      <HaiChar />
                    </div>
                  </span><br />
                  <span className="text-[#CD2E3A]">TRANSLATOR</span><br />
                  <span className="text-[#0A0A0A]">SUPREME</span>
                </h1>
              </div>
            </div>"""

appmode_translator_new = r"""        <div className="w-full max-w-md z-10 flex flex-col items-center pt-4 pb-12 animate-in fade-in duration-500">
          <div className="w-full flex flex-col items-center justify-center relative mb-12 mt-6 select-none">
            <div className="relative flex flex-col items-center justify-center w-[200px] -mb-4">
              <svg viewBox="0 0 200 80" className="w-[180px] h-auto mb-[-15px] z-10 overflow-visible">
                <path id="curve" d="M 10 70 Q 100 -10 190 70" fill="transparent" />
                <text width="200">
                  <textPath href="#curve" startOffset="50%" textAnchor="middle" className="fill-[#CD2E3A] text-[52px]" style={{ fontFamily: "'East Sea Dokdo', cursive" }}>
                    모던 한글
                  </textPath>
                </text>
              </svg>
              <img src="/kcharacters.webp" alt="Traditional Korean Dancers" className="w-[160px] object-contain drop-shadow-md z-0" />
            </div>
            <div className="mt-4 flex flex-col items-center">
              <span className="text-[14px] tracking-[0.25em] uppercase font-bold text-[#CD2E3A]" style={{ fontFamily: "var(--font-bubbly)" }}>
                — KOREAN TRANSLATOR SUPREME —
              </span>
            </div>
          </div>"""
content = content.replace(appmode_translator_block, appmode_translator_new)

# Remove closing bracket for appMode === 'translator'
closing_appmode_translator = r"""              </div>
            )}
          </div>
        )}

        {appMode === 'hangul' && ("""
closing_appmode_translator_new = r"""              </div>
            )}
          </div>

        {appMode === 'hangul' && ("""
content = content.replace(closing_appmode_translator, closing_appmode_translator_new)

# 10. Remove Hangul Mode Layout & Bottom Camera
hangul_mode_layout = r"""        \{appMode === 'hangul' && \([\s\S]*?        \}\)\}\n\n        <div className="absolute bottom-6 left-0 w-full flex justify-center z-40 pointer-events-none">\n          <button\n            onClick=\{\(\) => setIsLensOpen\(true\)\}\n            className="pointer-events-auto cursor-pointer drop-shadow-\[4px_4px_0px_#1A1A1A\] hover:drop-shadow-\[6px_6px_0px_#1A1A1A\] active:drop-shadow-\[0px_0px_0px_#1A1A1A\] transition-all duration-150 outline-none bg-transparent border-none p-0"\n            title="Supreme Lens"\n          >\n            <CartoonCamera />\n          </button>\n        </div>\n\n"""
content = re.sub(hangul_mode_layout, '', content)


with open('/home/bnkxx/vibe-sandbox/kts-hangul/src/App.tsx', 'w') as f:
    f.write(content)
