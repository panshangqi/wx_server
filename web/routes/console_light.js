//\033[42;30m
//字色编号：30黑，31红，32绿，33黄，34蓝，35紫，36深绿，37白色
//背景编号：40黑，41红，42绿，43黄，44蓝，45紫，46深绿，47白色
console.warn = (...message) => {
    console.log('\033[33m', ...message, '\033[0m')
}

console.error = (...message) => {
    console.log('\033[31m', ...message, '\033[0m')
}

console.success = (...message) => {
    console.log('\033[32m', ...message, '\033[0m')
}