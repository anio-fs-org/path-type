import {stat, lstat} from "@anio-fs/api/sync"
import path from "node:path"

function tryStat(path) {
	try {
		return stat(path)
	} catch (error) {
		if (error.code === "ENOENT") return false

		throw error
	}
}

function tryLinkStat(path) {
	try {
		return lstat(path)
	} catch (error) {
		if (error.code === "ENOENT") return false

		throw error
	}
}

export default function(...args) {
	const path_to_check = path.join(...args)

	//
	// try lstat first in case path is a symbolic link
	//
	const lstat = tryLinkStat(path_to_check)

	if (lstat === false) return false

	if (lstat.isSymbolicLink()) {
		const stat = tryStat(path_to_check)

		if (stat === false) return "link->broken"
		if (stat.isDirectory()) return "link->dir"

		return "link->file"
	}

	if (lstat.isDirectory()) return "dir"

	return "file"
}
