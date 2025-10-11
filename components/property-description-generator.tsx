"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Copy, RefreshCw, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PropertyDescriptionGenerator() {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDescription, setGeneratedDescription] = useState("")

  const [propertyType, setPropertyType] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [squareFootage, setSquareFootage] = useState("")
  const [address, setAddress] = useState("")
  const [features, setFeatures] = useState("")
  const [tone, setTone] = useState("")

  const handleGenerate = async () => {
    if (!propertyType || !bedrooms || !bathrooms || !squareFootage || !address || !features || !tone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType,
          bedrooms,
          bathrooms,
          squareFootage,
          address,
          features,
          tone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("[v0] API error:", data)
        toast({
          title: "Generation Failed",
          description:
            data.details || "Failed to generate description. Please check your API keys in environment variables.",
          variant: "destructive",
        })
        return
      }

      setGeneratedDescription(data.description)
    } catch (error) {
      console.error("[v0] Fetch error:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedDescription)
    toast({
      title: "Copied!",
      description: "Description copied to clipboard.",
    })
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Property Description Generator</h1>
        <p className="text-muted-foreground">Create compelling property descriptions in seconds</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Form */}
        <Card className="border-2 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Enter Property Details</CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in the information below to generate a professional description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property-type" className="text-card-foreground">
                Property Type
              </Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger id="property-type" className="border-border bg-input text-foreground">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-family">Single-Family Home</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="multi-family">Multi-Family</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="text-card-foreground">
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="3"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="border-border bg-input text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="text-card-foreground">
                  Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  placeholder="2.5"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="border-border bg-input text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="square-footage" className="text-card-foreground">
                Square Footage
              </Label>
              <Input
                id="square-footage"
                type="number"
                placeholder="2000"
                value={squareFootage}
                onChange={(e) => setSquareFootage(e.target.value)}
                className="border-border bg-input text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-card-foreground">
                Address
              </Label>
              <Input
                id="address"
                placeholder="123 Main St, City, State"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-border bg-input text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features" className="text-card-foreground">
                Key Features & Selling Points
              </Label>
              <p className="text-sm text-muted-foreground">Enter the best features, one per line. Be descriptive!</p>
              <Textarea
                id="features"
                placeholder="Newly renovated kitchen with quartz countertops&#10;Large fenced-in backyard with mature oak trees&#10;New roof in 2023&#10;Walking distance to schools and parks"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="min-h-32 border-border bg-input text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone" className="text-card-foreground">
                Choose a Tone
              </Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone" className="border-border bg-input text-foreground">
                  <SelectValue placeholder="Select writing style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern & Sleek</SelectItem>
                  <SelectItem value="cozy">Cozy & Charming</SelectItem>
                  <SelectItem value="luxury">Luxurious & Elegant</SelectItem>
                  <SelectItem value="family">Family-Friendly</SelectItem>
                  <SelectItem value="move-in">Move-in Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Description
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Display */}
        <Card className="border-2 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Generated Property Description</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your AI-generated description will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={generatedDescription}
              readOnly
              placeholder="Click 'Generate Description' to create your property listing..."
              className="min-h-96 border-border bg-input text-foreground"
            />

            {generatedDescription && (
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  className="flex-1 border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="flex-1 border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
