var es = {
	"usage: BabuinoLogo.js <logo file in> <basm file out>": "uso: BabuinoLogo.js <logo archivo en> <basm archivo salida>",
	"Parse error near >%s<, expecting '%s'":				"Error de análisis cerca >%s<, esperando '%s'",
	"Debug":												"Depurar",
	"Info":													"Información",
	"Debug":												"Depurar",
	"Info":													"Información",
	"Error":                                                "Error",
	"Warning":                                              "Advertencia",
	"Error reading file %s: %s":							"Error al leer archivo %s: %s", 
	"Compiling file %s":									"Compilar archivo %s",
	"Error compiling file %s: %s": 							"Error archivo compilar %s: %s",
	"Writing basm to file %s": 								"Escribir basm para presentar %s",
	"Error writing basm file %s: %s":						"Error al escribir el archivo basm %s: %s",
	"%s must be declared before use.":                      "%s debe ser declarado antes de su uso.",
	"No procedure defined for %s":                          "No existe un procedimiento definido para %s",
	"Cannot determine a return type for %s":                "No se puede determinar un tipo de cambio de %s",
	"Different return paths in %s have incompatible types": "Diferentes vías de retorno en %s tienen tipos incompatibles",
	"Cannot determine the type for a return path in %s":    "No se puede determinar el tipo de una vía de retorno de %s",
	"Call to undefined procedure %s":						"Llame al procedimiento definido %s",
	"Unknown configuration command: %s": 					"Comando de configuración Desconocido %s",
	"Not enough arguments available for %s":				"No hay suficientes argumentos para %s",

	"Unable to find a call to %s with a type resolved for argument %n": 
		"Incapaz de encontrar una llamada a %s con un tipo resuelto para el argumento %n",

	"A return value is expected from %s, but it returns no value.": "Un valor de retorno que se espera de %s, pero no devuelve nada.",
	"A type has not been determined for variable '%s'":       "Un tipo no ha sido determinada por '%s' variable",
	"A variable cannot be of type %s":						"Una variable no puede ser de tipo %s",
	"Invalid type for variable '%s'":						"Tipo no válida para la variable '%s'",
	"Motor selection %s not supported":						"Selección del motor %s no está soportado",
	"Operand of %s must be boolean":						"Operando de %s debe ser boolean",

	"%s and %s cannot be harmonised to a common type for %s": "%s y %s no se puede armonizar con un tipo común para %s",

	"Both operands of %s must be boolean":					"Ambos operandos de %s debe ser boolean",
	"Both operands of %s must be comparable":				"Ambos operandos de %s deben ser comparables",
	"Operand of %s must be numeric": 						"Operando de %s debe ser numérico",
	"Both operands of %s must be numeric": 					"Ambos operandos de% s deben ser numéricos",
	"Cannot perform bitwise operations on non-integer types": "No se puede realizar operaciones bit a bit en tipos no enteros",
	"The variable name '%s' clashes with a parameter name": "El nombre de la variable '%s' enfrentamientos con un nombre de parámetro",
	"A variable named '%s' already exists in this scope":   "Una variable llamada '%s' ya existe en este ámbito",

	"The variable name '%s' clashes with a variable in an outer scope. It has been renamed to '%s' for the target output.":
		"El nombre de la variable '%s' enfrentamientos con una variable en un ámbito exterior. Se ha cambiado el nombre a '%s' para la salida de destino.",

	"Internal error: Clash of variable name '%s'. Renaming appears to have failed.": "Error interno: Choque de nombre de la variable '%s'. Cambio de nombre parece haber fracasado.",

	"Outer reference here:":								"Referencia externa aquí:",

	"Variable '%s' was renamed to '%s'. This reference to it will be changed accordingly.": "Variable '% s' ha sido renombrado como '% s'. Esta referencia a que se cambiará en consecuencia.",

	"Redefinition of procedure %s":								"Redefinición del procedimiento %s",
	"Procedure first declared here:":							"Procedimiento declaró por primera vez aquí:",
	"Cannot dereference %s any further":						"No puede eliminar la referencia %s más lejos",
	"%s requires %n parameters but has been supplied with %n":	"%s requiere %n parámetros, pero se ha suministrado con %n",

	"Serial configuration requires a port number followed by a list of parameters":
		"Configuración de serie requiere un número de puerto seguido por una lista de parámetros",

	"Cannot parse serial parameter '%s'":						"No se puede analizar el parámetro de serie '%s'"

};
module.exports = es;
