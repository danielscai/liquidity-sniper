package main

import (
	"fmt"
)

const (
	p0 int = iota * 32
	p1
	p2
	p3
	p4
	p5
)

func main() {
	fmt.Printf("p0 %d,p1 %d, p2 %d, p3 %d, p4 %d, p5 %d", p0, p1, p2, p3, p4, p5)
}
