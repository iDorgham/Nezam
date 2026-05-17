import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

export async function POST(request: Request) {
  try {
    const { command } = await request.json()
    
    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 })
    }

    console.log(`[Silent CLI]: ${command}`)
    
    try {
      const { stdout, stderr } = await execPromise(command, {
        env: { ...process.env, PATH: `${process.env.PATH}:.` }
      })
      return NextResponse.json({ 
        success: true, 
        command, 
        output: stdout || stderr 
      })
    } catch (e: any) {
      return NextResponse.json({ 
        success: false, 
        command, 
        output: e.message 
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to execute command', details: error.message },
      { status: 500 }
    )
  }
}
