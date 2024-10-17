"use client"

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ColorToken = {
  name: string
  value: string
  category: string
}

const colorTokens: ColorToken[] = [
  // Surface
  { name: "surface-primary", value: "#FFFFFF", category: "Surface" },
  { name: "surface-secondary", value: "#F3F3F3", category: "Surface" },
  { name: "surface-tertiary", value: "#E8E8E8", category: "Surface" },
  { name: "surface-brand", value: "#3DD6B5", category: "Surface" },
  { name: "surface-alt", value: "#8B3DFF", category: "Surface" },
  { name: "surface-accent", value: "#FFD600", category: "Surface" },
  { name: "surface-brand-dark", value: "#2BAA8F", category: "Surface" },
  { name: "surface-alt-dark", value: "#3D2B70", category: "Surface" },
  { name: "surface-accent-dark", value: "#CCAB00", category: "Surface" },
  { name: "surface-overlay", value: "#262627", category: "Surface" },
  { name: "surface-tint-brand", value: "#E8FBF7", category: "Surface" },
  { name: "surface-tint-alt", value: "#F2EBFF", category: "Surface" },
  { name: "surface-tint-accent", value: "#FFFBE6", category: "Surface" },

  // Text
  { name: "text-primary", value: "#262627", category: "Text" },
  { name: "text-secondary", value: "#6E6E6E", category: "Text" },
  { name: "text-tertiary", value: "#A0A0A0", category: "Text" },
  { name: "text-disabled", value: "#D1D1D1", category: "Text" },
  { name: "text-brand", value: "#3DD6B5", category: "Text" },
  { name: "text-inverse", value: "#FFFFFF", category: "Text" },

  // Border
  { name: "border-primary", value: "#F3F3F3", category: "Border" },
  { name: "border-secondary", value: "#262627", category: "Border" },
  { name: "border-brand", value: "#3DD6B5", category: "Border" },
  { name: "border-brand-dark", value: "#2BAA8F", category: "Border" },

  // Icon
  { name: "icon-primary", value: "#262627", category: "Icon" },
  { name: "icon-secondary", value: "#6E6E6E", category: "Icon" },
  { name: "icon-tertiary", value: "#A0A0A0", category: "Icon" },
  { name: "icon-brand", value: "#3DD6B5", category: "Icon" },
  { name: "icon-alt", value: "#8B3DFF", category: "Icon" },
  { name: "icon-accent", value: "#FFD600", category: "Icon" },
  { name: "icon-success", value: "#3DD6B5", category: "Icon" },
  { name: "icon-warning", value: "#FFD600", category: "Icon" },

  // System
  { name: "system-success", value: "#3DD6B5", category: "System" },
  { name: "system-error", value: "#E45356", category: "System" },
  { name: "system-warning", value: "#FFD600", category: "System" },
  { name: "system-info", value: "#3D7DFF", category: "System" },
  { name: "system-success-light", value: "#E8FBF7", category: "System" },
  { name: "system-error-light", value: "#FDEBEB", category: "System" },
  { name: "system-warning-light", value: "#FFFBE6", category: "System" },
  { name: "system-info-light", value: "#EBF2FF", category: "System" },

  // Color Palette
  { name: "aqua-50", value: "#E8FBF7", category: "Color Palette" },
  { name: "aqua-100", value: "#D0F8EF", category: "Color Palette" },
  { name: "aqua-300", value: "#7FEDD9", category: "Color Palette" },
  { name: "aqua-500", value: "#3DD6B5", category: "Color Palette" },
  { name: "aqua-700", value: "#2BAA8F", category: "Color Palette" },
  { name: "aqua-900", value: "#1A6C5C", category: "Color Palette" },

  { name: "gold-50", value: "#FFFBE6", category: "Color Palette" },
  { name: "gold-100", value: "#FFF8CC", category: "Color Palette" },
  { name: "gold-300", value: "#FFEB80", category: "Color Palette" },
  { name: "gold-500", value: "#FFD600", category: "Color Palette" },
  { name: "gold-700", value: "#CCAB00", category: "Color Palette" },
  { name: "gold-900", value: "#806B00", category: "Color Palette" },

  { name: "violet-50", value: "#F2EBFF", category: "Color Palette" },
  { name: "violet-100", value: "#E6D6FF", category: "Color Palette" },
  { name: "violet-300", value: "#BE8FFF", category: "Color Palette" },
  { name: "violet-500", value: "#8B3DFF", category: "Color Palette" },
  { name: "violet-700", value: "#6F31CC", category: "Color Palette" },
  { name: "violet-900", value: "#3D2B70", category: "Color Palette" },

  { name: "success-700", value: "#3DD6B5", category: "Color Palette" },
  { name: "error-700", value: "#E45356", category: "Color Palette" },
  { name: "warning-700", value: "#FFD600", category: "Color Palette" },
  { name: "info-700", value: "#3D7DFF", category: "Color Palette" },

  { name: "success-300", value: "#E8FBF7", category: "Color Palette" },
  { name: "error-300", value: "#FDEBEB", category: "Color Palette" },
  { name: "warning-300", value: "#FFFBE6", category: "Color Palette" },
  { name: "info-300", value: "#EBF2FF", category: "Color Palette" },

  { name: "neutral-0", value: "#FFFFFF", category: "Color Palette" },
  { name: "neutral-40", value: "#F3F3F3", category: "Color Palette" },
  { name: "neutral-50", value: "#F2F2F2", category: "Color Palette" },
  { name: "neutral-80", value: "#E8E8E8", category: "Color Palette" },
  { name: "neutral-300", value: "#D1D1D1", category: "Color Palette" },
  { name: "neutral-500", value: "#A0A0A0", category: "Color Palette" },
  { name: "neutral-700", value: "#6E6E6E", category: "Color Palette" },
  { name: "neutral-900", value: "#262627", category: "Color Palette" },
  { name: "neutral-900-80", value: "#262627CC", category: "Color Palette" },
]

export function ColorTokensShowcaseComponent() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const copyToClipboard = (value: string, name: string) => {
    navigator.clipboard.writeText(value)
    setCopiedToken(name)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const categories = Array.from(new Set(colorTokens.map(token => token.category)))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Color Tokens</h1>
      {categories.map(category => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {colorTokens.filter(token => token.category === category).map((token) => (
              <TooltipProvider key={token.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="overflow-hidden">
                      <div
                        className="h-24 w-full"
                        style={{ backgroundColor: token.value }}
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1 truncate">{token.name}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 text-gray-900"
                          onClick={() => copyToClipboard(token.value, token.name)}
                        >
                          {copiedToken === token.name ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {token.value}
                        </Button>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}