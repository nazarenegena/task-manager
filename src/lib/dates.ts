export function toISODate(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

export function fromISODate(value: string | Date | undefined): Date {
	if (value instanceof Date) return value;
	if (!value) return new Date();
	const d = new Date(`${value}T00:00:00`);
	return isNaN(d.getTime()) ? new Date() : d;
}

export function formatDay(date: Date | string | undefined): string {
	const d = date instanceof Date ? date : date ? new Date(`${date}T00:00:00`) : null;
	if (!d || isNaN(d.getTime())) return '';
	return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTimeRange(start?: Date, end?: Date): string {
	if (!start) return '';
	const s = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	const e = end ? end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
	return e && e !== s ? `${s} – ${e}` : s;
}

export function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}
